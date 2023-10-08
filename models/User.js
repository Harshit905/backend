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
    skills:{
        type: String
    },
    github:{
        type: String
    },
    about_yourself: {
        type: String,
        required: true
    }
});
const User = mongoose.model('user', UserSchema);
// User.createIndexes();
module.exports = User;