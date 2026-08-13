export default function errorHandler(err, req, res, next) {
  return res.status(500).json({
    success: false,
    message: `Something went wrong: ${err.message}`,
  });
}
