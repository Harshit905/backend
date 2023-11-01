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
    likes: {
        type: Array,
        default: []
      },
    comments: [
        {
          userId: {
            type: String,
            // required: true
          },
          info: {
            type: String,
            // required: true
          },
          blogId: {
            type: String,
            // required: true
          }
        }
      ],
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('blogs', BlogSchema);