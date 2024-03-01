const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import the User model
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeaders = req.headers.token;
    if (!authHeaders) {
        throw new Error('No Token Found');
    }
    const token = authHeaders.split(" ")[1];
    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            const user = await User.findById(decoded?.id);
            req.user = user; // store in user 
            next();
        }
    } catch (error) {
        throw new Error('Invalid Token');
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email })
    if (adminUser.role !== 'admin') {
        throw new Error("You are not admin")
    } else {
        next()
    }
})
module.exports = { authMiddleware, isAdmin }
