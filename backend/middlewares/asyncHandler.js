export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: err.message, success: false, statusCode });
  });
};
