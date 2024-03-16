
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const generateToken = require("../config/jwtToken")
const generateRefreshToken = require("../config/refreshToken")
const validateMongoDbId = require('../utils/validateMongodbId')
const { CLIENT_RENEG_LIMIT } = require('tls')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('./emailCtrl')


// creat new user 
const creatUser = asyncHandler(async (req, res, next) => {
    const email = req.body.email;

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User already exists")
    }

});


// login user 
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email");
        }
        if (!(await user.isPasswordMatched(password))) {
            throw new Error("Invalid password");
        }
        const refreshToken = await generateRefreshToken(user?._id)

        const updatedUser = await User.findByIdAndUpdate(
            user.id, {
            refreshToken: refreshToken,
        },
            {
                new: true
            }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const token = await generateToken(user._id);
        res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            token: token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Handel refreshToken 

const handelerRefreshtoken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies.refreshToken) {
        throw new Error('No refresh token in Cookies');
    }

    const refreshToken = cookies.refreshToken;
    console.log("Received Refresh Token:", refreshToken);

    let user;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new Error("Invalid refresh token");
    }

    if (!user) {
        throw new Error("User not found");
    }

    const accessToken = generateToken(user._id);

    res.json({ accessToken });
});


// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        return res.status(400).json({ message: 'No refresh token in Cookies' });
    }
    const refreshToken = cookies.refreshToken;
    try {
        if (!validateMongoDbId(refreshToken)) {
            res.clearCookie('refreshToken', {
                secure: true,
                httpOnly: true
            });
            return res.status(204).json({ message: 'Logged out successfully' });
        }
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('refreshToken', {
                secure: true,
                httpOnly: true
            });
            return res.status(204).json({ message: 'Logged out successfully' });
        }
        user.refreshToken = undefined;
        await user.save();
        res.clearCookie('refreshToken', {
            secure: true,
            httpOnly: true
        });
        res.status(204).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// delete user 
const deleteUser = asyncHandler(async (req, res) => {
    try {

        const { id } = req.params
        validateMongoDbId(id)

        const user = await User.findByIdAndDelete(id)
        if (!user) {
            throw new Error('user not found')
        }
        res.status(200).json('user deleted')

    } catch (error) {
        throw new Error(error)
    }
})

// update user 
const updateUser = asyncHandler(async (req, res) => {
    try {
        // const userId = req.params.id
        const { _id } = req.user;
        validateMongoDbId(_id)
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                // $set: req.body
                firstname: req.body.firstname,
                lastname: req.body.lastname,

                email: req.body.email,
                mobile: req.body.mobile,
                //   password: req.body.password,
            },
            {
                new: true
            });

        if (!updatedUser) {
            throw new Error('user not found')
        }
        res.status(200).json(updatedUser)

    } catch (error) {
        throw new Error(error)
    }
})

// get all user 
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)

    } catch (error) {
        throw new Error(error)
    }
})


// get a single user 
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    // validateMongoDbId(_id)

    const user = await User.findById(id)
    if (!user) {
        throw new Error('user not found')
    }
    res.json(user)
})


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    if (id === req.user.id) {
        res.json('you cant block your self please enter another id')
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.isBlocked = true;
        const blockedUser = await user.save();
        res.status(200).json(blockedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

const unBlockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id)

    if (id === req.user.id) {
        res.json('you cant unblock your self please enter another id')
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.isBlocked = false;
        const unBlockedUser = await user.save();
        res.status(200).json(unBlockedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})




// get all blokedusers emails
const allBlockedUsers = asyncHandler(async (req, res) => {
    try {
        const blockedUsers = await User.find({ isBlocked: true })

        const blockedUseremail = blockedUsers.map(user => user.email);

        res.status(200).json(blockedUseremail);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});




// Update user password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } else {
        res.status(400).json({ error: "Password not provided" });
    }
});

// Generate and send password reset token

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Please enter email');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found with this email');
    }

    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `http://localhost:4000/api/user/reset-password/${token}`;

        const data = {
            to: email,
            subject: "Forgot Password - Reset Link",
            html: `<p>Hi, please follow this <a href="${resetUrl}">link</a> to reset your password.</p>`,
            text: "Hello user, please use the following link to reset your password: " + resetUrl
        };

        await sendEmail(data);
        res.json({ message: `Password reset link sent to Your email : ${email}` });
    } catch (error) {
        throw new Error(error.message);
    }
});

const resetPasswoed = asyncHandler(async (req, res) => {
    const { _id } = req.body
    validateMongoDbId(_id)
})

module.exports = {
    creatUser,
    loginUser,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    allBlockedUsers,
    handelerRefreshtoken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPasswoed
}


// const updatePassword = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { password } = req.body;
//     validateMongoDbId(_id);
//     const user = await User.findById(_id);
//     if (password) {
//         user.password = password;
//         const updatedPassword = await user.save()
//         res.json(updatedPassword)
//     } else {
//         res.json(user);
//     }

// });




// const forgotPasswordToken = asyncHandler(async (req, res) => {
//     const { email } = req.body;
//     if (!email) {
//         throw new Error('Please enter email')
//     }
//     const user = await User.findOne({ email })
//     if (!user) {
//         throw new Error('user not found this email ')

//     }

//     try {
//         const token = await user.createPasswordResetToken()
//         await user.save();
//         const resetUrl = `Hi please folloe this link to reset password > link valid tell 30 minits from now <a href="http:localhost:4000/api/user/rest-password/${token} "></a>`
//         const data = {
//             to: email,
//             subject: "forgot passwordLink",
//             html: resetUrl,
//             text: "Hello user"
//         }
//         sendEmail(data)
//         res.json(token)
//     } catch (error) {
//         throw new Error(error)

//     }


// })
