const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = asyncHandler (async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, Please login");
        }

        //verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //get user id from token
        const user = await User.findById(verified.id).select("-password")

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        req.user = user;
        next()

    } catch (error) {
        res.status(401);
        throw new Error("An Error have occurred")
    }
});


// Middleware to update lastAccess field

// const updateLastAccess = async (req, res, next) => {
//     try {
//       const userId = req.user._id; // Assuming the user ID is in the token
//       await User.findByIdAndUpdate(userId, { lastAccess: Date.now() });
//       next(); // Continue to the secured route handler
//     } catch (err) {
//         res.status(401);
//         throw new Error("An Error have occurred")
//     }
//   };


//Admin Only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as an admin")
    }
}

module.exports = { protect, adminOnly } ;