export function errorMiddleware(err, _req, res, _next) {
    console.log(err);

    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        message,
        ...(process.env.NODE_ENV != "production" ? {stack: err.stack} : {}),
    });
}