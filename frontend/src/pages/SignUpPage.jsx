import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";

export const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [errMessage, setErrMessage] = useState("");

  const User = z
    .object({
      username: z.string().nonempty({ message: "Username is required" }),
      email: z.string().email({ message: "Invalid email" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      User.parse(formData);
      setErrMessage("");
      const resposnse = await axios.post("/api/auth/signup", formData);
      console.log(resposnse.data);
      toast.success("Registered successfully", { position: "bottom-right" });
    } catch (error) {
      setError(true);
      if (error instanceof z.ZodError) {
        setErrMessage(error.errors[0].message);
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto space-y-4 pt-10">
      <h1 className="text-center h2-bold">SignUp</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="shad-input"
          placeholder="username"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shad-input"
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="shad-input"
          placeholder="password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="shad-input"
          placeholder="confirm password"
        />
        {errMessage && <p className="text-red">{errMessage}</p>}
        <button
          disabled={loading}
          type="submit"
          className={`shad-button_primary ${
            loading ? "disabled:bg-light-1" : ""
          }`}
        >
          {loading ? "Submitting..." : "SignUp"}
        </button>
      </form>
      <p className="text-light-3 text-center">
        {`Already have an account? `}
        <Link to="/sign-in" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
};
