import { useSelector } from "react-redux";

export const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto text-center pt-10">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <img
          src={currentUser.profileImage}
          alt="profile"
          className="mx-auto h-24 w-24 rounded-full object-contain"
        />
        <input
          type="text"
          className="shad-input"
          placeholder="Username"
          value={currentUser.username}
        />
        <input
          type="email"
          className="shad-input"
          placeholder="Email"
          value={currentUser.email}
        />
        <input type="password" className="shad-input" placeholder="Password" />
        <button className="shad-button_primary text-white p-2 rounded">
          Update
        </button>
      </form>
      <div className="flex justify-between text-red-500 mt-4">
        <p className="cursor-pointer">Delete Account</p>
        <p className="cursor-pointer">Sign Out</p>
      </div>
    </div>
  );
};
