import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-primary-500">
      <div className="flex-between max-w-6xl p-3 mx-auto">
        <h1 className="h3-bold">Auth App</h1>
        <ul className="flex-center gap-4">
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About</Link>
          <Link to={"/profile"}>
            {currentUser ? (
              // <button className="btn btn-outline">Sign Out</button>
              <img
                src={currentUser.profileImage}
                alt={currentUser.username}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <button className="btn btn-outline">Sign In</button>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};
