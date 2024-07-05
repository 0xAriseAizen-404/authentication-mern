import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { signInSuccess, signOut } from "../redux/user/userSlice";

export const Home = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      // Redirect to sign in page if user is not logged in
      // For example, using react-router:
      // history.push("/signin");
    }
  }, [currentUser]);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`);
      dispatch(signOut());
      // Redirect to sign up page after account deletion
      // For example, using react-router:
      // history.push("/signup");
    } catch (error) {
      console.error("Delete account error:", error.message);
      setDeleteError("Failed to delete account. Please try again.");
    }
  };

  const handleSignOut = () => {
    // Perform sign out actions
    dispatch(signOut());
    // Redirect to sign in page after sign out
    // For example, using react-router:
    // history.push("/signin");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-lg mx-auto text-center pt-10">
      <h1 className="text-2xl font-semibold mb-4">Home Page</h1>
      {currentUser ? (
        <div>
          <img
            src={currentUser.profileImage || "defaultProfileImage.png"}
            alt="profile"
            className="mx-auto h-24 w-24 rounded-full object-contain mb-4"
          />
          <p className="mb-2">Username: {currentUser.username}</p>
          <p className="mb-2">Email: {currentUser.email}</p>
          {/* <div className="flex justify-between mt-10">
            <button
              onClick={handleSignOut}
              className="shad-button_primary text-white p-2 rounded mb-2"
            >
              Sign Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="shad-button_primary text-white p-2 rounded"
            >
              Delete Account
            </button>
          </div> */}
          {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        </div>
      ) : (
        <p>Please sign in to view your details.</p>
      )}
    </div>
  );
};
