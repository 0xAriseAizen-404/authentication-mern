import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useParams } from "react-router-dom";

export const ResetPassword = () => {
  const { token } = useParams();

  //   const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errMessage, setErrMessage] = useState("");

  const User = z
    .object({
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
      User.parse(formData);
      setErrMessage("");
      const resposnse = await axios.post(
        `/api/auth/reset-pass/${token}`,
        formData
      );
      console.log(resposnse.data);
      toast.success("Reset Password successfully", {
        position: "bottom-right",
      });
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrMessage(error.errors[0].message);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3 space-y-4 pt-10">
      <h1 className="text-center h2-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        {errMessage && <p className="text-red-500">{errMessage}</p>}
        <button type="submit" className="shad-button_primary">
          Update
        </button>
      </form>
    </div>
  );
};
