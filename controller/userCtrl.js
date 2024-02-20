
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
// const bcrypt = require("bcrypt")
// const jwt = require('jsonwebtoken')
const generateToken = require("../config/jwtToken")
// const { all } = require('../routes/authRout')

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


// delete user 
const deleteUser = asyncHandler(async (req, res) => {
    try {

        const userId = req.params.id
        const user = await User.findByIdAndDelete(userId)
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
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                // $set: req.body
                firstname: req.body.firstname,
                lastname: req.body.lastname,

                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
            },
            {
                new: true
            });

        if (!updatedUser) {
            throw new Error('user not found')
        }
        res.status(200).json(updatedUser)
        res.status(200).json('user has been updated deleted')

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
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
        throw new Error('user not found')
    }
    res.json(user)
})


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
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




module.exports = {
    creatUser,
    loginUser,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    allBlockedUsers






}