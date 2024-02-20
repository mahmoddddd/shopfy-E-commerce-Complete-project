// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
    // Create a new Error object with a message indicating the requested URL was not found
    const error = new Error(`Not Found: ${req.originalUrl}`);
    // Set the response status to 404 Not Found
    res.status(404);
    // Pass the error to the next middleware in the chain
    next(error);
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;  // ? vlue if ture:vlue if false
    // Set the response status code
    res.status(statusCode);
    // Send a JSON response with the error message and stack trace (if available)
    res.json({
        message: err.message,
        stack: err.stack
    });
};

// Exporting the middleware functions
module.exports = {
    notFound,
    errorHandler
};
