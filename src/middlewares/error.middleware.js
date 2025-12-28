export function errorMiddleware(err, req, res, next) {
    console.error(err.stack);
    
    const errStatus = err.statusCode || 500;
    const errMessage = err.message || "Something went wrong!";

    res.status(errStatus).json({
        success:false, 
        status: errStatus,
        message: errMessage
    });
};