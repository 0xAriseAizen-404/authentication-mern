import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signOut,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import toast from "react-hot-toast";

export const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        password: "", // Leave password empty for security reasons
        profileImage: currentUser.profileImage,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const handleImageUpload = async () => {
      if (!image) return;

      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageProgress(Math.round(progress));
        },
        (error) => {
          console.error("Image upload error:", error);
          setImageError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prevData) => ({
              ...prevData,
              profileImage: downloadURL,
            }));
          });
        }
      );
    };
    handleImageUpload();
  }, [image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData
      );
      dispatch(updateUserSuccess(res.data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart());
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`);
      dispatch(deleteUserSuccess());
      // Optionally, redirect to another page or clear user state
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/auth/signout");
      toast.success(res.data.message, {
        position: "bottom-right",
        duration: 2000,
      });
      dispatch(signOut());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
    // Optionally, redirect to login page
  };

  return (
    <div className="max-w-lg mx-auto text-center pt-10">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profileImage || currentUser.profileImage}
          alt="profile"
          className="mx-auto h-24 w-24 rounded-full object-contain cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        {imageProgress > 0 && imageProgress < 100 && (
          <p>Upload progress: {imageProgress}%</p>
        )}
        {imageProgress === 100 && (
          <p className="text-green-500">Uploaded Successfully</p>
        )}
        {imageError && <p className="text-red-500">Failed to upload image</p>}
        <input
          type="text"
          className="shad-input"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="email"
          className="shad-input"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          className="shad-input"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="shad-button_primary text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between text-red-500 mt-4">
        <p className="cursor-pointer" onClick={handleDeleteAccount}>
          {loading ? "Deleting..." : "Delete Account"}
        </p>
        <p className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </p>
      </div>
    </div>
  );
};
