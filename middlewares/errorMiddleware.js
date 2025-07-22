//Global error handling

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err}; //shallow copy
        error.message = err.message;
        console.error(err);


        //Try to findout the type of error
        //Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode =404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode =400;
        }

        //Mongoose  validation erroe (when not passing the right props)
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message); //might have many validation errors
            error = new Error(message.join(', '));
            error.statusCode =400;
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
    
    } catch (error) {
        next(error);
    }
};

module.exports = errorMiddleware;
