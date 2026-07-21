var errorHandler2 = (err, req, res, next) => {
      let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      let message = err.message;
      if (err.name === "CastError" && err.kind === "ObjectId") {
        message = "Resource not found";
        statusCode = 404;
      }
      if (err.code === 11e3) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 400;
      }
      if (err.name === "ValidationError") {
        message = Object.values(err.errors).map((val) => val.message).join(", ");
        statusCode = 400;
      }
      res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
      });
    };
    module.exports = errorHandler2;
