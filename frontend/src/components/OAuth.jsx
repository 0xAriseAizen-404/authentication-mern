import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const { user } = await signInWithPopup(auth, provider);

      const res = await axios.post("/api/auth/google", {
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      });

      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.error("Could not login with Google", error);
      console.error("Error details:", error.response);
      // Optionally, display an error message to the user
    }
  };

  return (
    <button
      type="button"
      className="bg-light-4 py-2 rounded-md"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </button>
  );
};
