const gfs = require('./file-handling/gridfs-setup');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
// ...rest of your file upload route logic


const express = require('express');
var fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const Blog = require('../models/Blog');
const { body, validationResult } = require('express-validator');


//fetch all the blogs
router.get('/fetchallblogs', async (req, res) => {
    try {
        const blogs = await Blog.find({ });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error in Fetching all the Blogs' });
    }

})

//fetch user blogs
router.get('/fetchuserblogs', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server error in Fetching user blogs' });
    }

})

//add a blog by user

router.post('/addblog', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('content', 'content must be atleast 5 characters').isLength({ min: 5 }),
    body('inbrief', 'inbrief must be atleast 5 characters').isLength({ min: 5 }),
    body('author', 'author must be atleast 5 characters').isLength({ min: 2 }),
    body('tag', 'tag must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {


        const { title, content, tag, inbrief,author,filename,fileId } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const blog = new Blog({
            title, content, tag, user: req.user.id, inbrief,author, 
        })
        const saveBlog = await blog.save()


        res.json(saveBlog);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server error in adding blog'  });
    }
})