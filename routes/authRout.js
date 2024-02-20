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
    allBlockedUsers

} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post('/register', creatUser);

router.post('/login', loginUser);

router.get('/getBlockedUsers', authMiddleware, isAdmin, allBlockedUsers);
router.get('/get-all-users', getAllUser);

router.get('/:id', authMiddleware, isAdmin, getUser);

router.delete('/:id', deleteUser);

router.put('/:id', authMiddleware, updateUser);

router.put('/block/:id', authMiddleware, isAdmin, blockUser);

router.put('/unblock/:id', authMiddleware, isAdmin, unBlockUser);


module.exports = router;
