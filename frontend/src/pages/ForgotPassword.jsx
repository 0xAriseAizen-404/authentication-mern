import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  //   const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-pass", { email });
      // console.log(res);
      //   toast.success("Logged in successfully", {
      //     position: "bottom-right",
      //     duration: 2000,
      //   });
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.message || error.message);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3 space-y-4 pt-10">
      <h1 className="text-center h2-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shad-input"
          placeholder="Email"
        />

        <button type="submit" className="shad-button_primary">
          send
        </button>
      </form>
    </div>
  );
};
