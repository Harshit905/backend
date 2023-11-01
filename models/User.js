const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    university: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    registration: {
        type: String,
        required: true,
        unique: true
    },
    skills: {
        type: String
    },
    github: {
        type: String
    },
    about_yourself: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    profilePic: {
        type: String,
        // default:"https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png"
    },
    instagram: {
        type: String,
    },
    twitter: {
        type: String,
    },
    facebook: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    bookmarks: {
        type: Array,
        default: [],
    },
    tokens: [
        {
            token: {
                type: String,
                // required:true
            },
        },
    ]
});
const User = mongoose.model('user', UserSchema);
// User.createIndexes();
module.exports = User;