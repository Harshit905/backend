// const gfs = require('../file-handling/gridfs_setup');
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const imageUploadRouter = require('./imageUpload');
// ...rest of your file upload route logic


const express = require('express');
var fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const Blog = require('../models/Blog');
const { body, validationResult } = require('express-validator');


//fetch all the blogs
router.get('/fetchallblogs', async (req, res) => {
    try {
        const blogs = await Blog.find({});
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


// Endpoint to fetch a single blog post by ID
router.get('/readblog/:id', (req, res) => {
    const postId = req.params.id;
  
    Blog.findById(postId, (err, blog) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving blog post.');
      } else {
        res.json(blog);
      }
    });
});

// router.use('/images',imageUploadRouter);
//add a blog by user
router.post('/addblog', fetchuser, [
    body('title', 'enter a valid title of min 10 characters').isLength({ min: 10 }),
    body('content', 'content must be atleast 80 characters').isLength({ min: 100 }),
    body('inbrief', 'inbrief must be atleast 5 characters').isLength({ min: 20 }),
    body('author', 'author must be atleast 5 characters').isLength({ min: 2 }),
    body('tag', 'tag must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {


        const { title, content, tag, inbrief, author } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const blog = new Blog({
            title, content, tag, user: req.user.id, inbrief, author
        })
        const saveBlog = await blog.save()
        

        res.json(saveBlog);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server error in adding blog' });
    }
})
//update a blog by user
router.put('/updateblog/:id', fetchuser, async (req, res) => {
    const { title, content, tag, inbrief, author } = req.body;
    try {
        // Create a newBlog object
        const newBlog = {};
        if (title) { newBlog.title = title };
        if (content) { newBlog.content = content };
        if (tag) { newBlog.tag = tag };
        if (tag) { newBlog.inbrief = inbrief };
        if (tag) { newBlog.author = author };

        // Find the blog to be updated and update it
        let blog = await Blog.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found for updating") }

        if (blog.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed to update");
        }
        blog = await Blog.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true })
        res.json({ blog });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error in updating");
    }
})
 
//delete blog
router.delete('/deleteblog/:id', fetchuser, async (req, res) => {
    try {
        // Find the blog to be delete and delete it
        let blog = await Blog.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found to delete") }

        // Allow deletion only if user owns this Blog
        if (blog.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed to delete");
        }

        blog = await Blog.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Blog has been deleted", blog: blog });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error in deleting");
    }
})
module.exports = router;