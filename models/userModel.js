const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    }, lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ], wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)

})

userSchema.methods.isPasswordMatched = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password)
}

module.exports = mongoose.model('User', userSchema);