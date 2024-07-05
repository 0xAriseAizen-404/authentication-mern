import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
// import { SuccessToast } from "../common/Toasts/SuccessToast";

export const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "vamsi@gmail.com",
    password: "vamsi@123",
  });

  const [errMessage, setErrMessage] = useState("");

  const SignInSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .nonempty({ message: "Email is required" }),
    password: z.string().nonempty({ message: "Password is required" }),
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      SignInSchema.parse(formData);
      setErrMessage("");
      const response = await axios.post("/api/auth/signin", formData);
      console.log(response.data);
      toast.success("Logged in successfully", {
        position: "bottom-right",
        duration: 2000,
      });
      dispatch(signInSuccess(response.data));
      navigate("/");
      // SuccessToast({ message: "Logged in successfully" });
    } catch (error) {
      dispatch(signInFailure(error.message));
      if (error instanceof z.ZodError) {
        setErrMessage(error.errors[0].message);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3 space-y-4 pt-10">
      <h1 className="text-center h2-bold">SignIn</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shad-input"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="shad-input"
          placeholder="Password"
        />
        {errMessage && <p className="text-red">{errMessage}</p>}
        <button type="submit" className="shad-button_primary">
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <p className="text-light-3 text-center">
        {`New User? `}
        <Link to="/sign-up" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
};
