import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="bg-primary-500">
      <div className="flex-between max-w-6xl p-3 mx-auto">
        <h1 className="h3-bold">Auth App</h1>
        <ul className="flex-center gap-4">
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About</Link>
          <Link to={"/sign-in"}>SignIn</Link>
        </ul>
      </div>
    </div>
  );
};
