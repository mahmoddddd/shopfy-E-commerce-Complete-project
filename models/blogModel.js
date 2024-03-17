const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },

    dislike: {
        type: Number,
        default: 0
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dislikes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, img: {
        type: String,
        default: "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-600w-1029506242.jpg"
    },
    author: {
        type: String,
        default: "Admin"
    }

}
    , {
        toJSON: {
            virtuals: true
        },
        timestamps: true
    });

module.exports = mongoose.model('Blog', blogSchema);
