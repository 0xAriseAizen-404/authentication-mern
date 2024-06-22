import toast from "react-hot-toast";

export const SuccessToast = ({ message }) => {
  toast.custom(
    <div className="text-base border border-primary-600 p-4 text-light-2 rounded-md bg-primary-600 shadow-md">
      {message}
    </div>,
    { position: "bottom-right", duration: 2000 }
  );
};
