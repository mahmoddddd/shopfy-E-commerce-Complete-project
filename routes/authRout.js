const express = require('express');
const router = express.Router();

const {
    creatUser,
    loginUser,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    blockUser,
    unBlockUser,
    allBlockedUsers,
    handelerRefreshtoken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPasswoed
} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post('/register', creatUser);
router.put('/change-password', authMiddleware, updatePassword);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password', resetPasswoed);

router.post('/login', loginUser);
router.get('/getBlockedUsers', authMiddleware, isAdmin, allBlockedUsers);
router.get('/get-all-users', getAllUser);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/:id', authMiddleware, deleteUser);
router.put('/:id', authMiddleware, updateUser);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unBlockUser);
router.get('/refresh', handelerRefreshtoken);
router.get('/logout', logoutUser);


module.exports = router;
