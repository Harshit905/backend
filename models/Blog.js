const mongoose = require('mongoose')
const { Schema } = mongoose;

const BlogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    inbrief:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
    // filename: {
    //     type: String
    // },
    // fileId: {
    //     type: String
    // }
});
module.exports = mongoose.model('blogs', BlogSchema);