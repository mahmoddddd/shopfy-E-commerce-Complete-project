const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },

    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo"]
    },


    quantity: {
        type: Number,
        required: true,
        // default: 0
        //   select: false

    },
    sold: {
        type: Number,
        default: 0,
        // select: false
    },

    images: {
        type: Array
    }
    ,

    color: {
        type: String,
        required: true
        //  enum: ["Red", "Black", "Brown"]
    },

    ratings:
        [
            {
                star: Number,
                postedby: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            }]

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);