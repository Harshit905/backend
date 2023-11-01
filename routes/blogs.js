// const gfs = require('../file-handling/gridfs_setup');
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const imageUploadRouter = require('./imageUpload');
// ...rest of your file upload route logic


const express = require('express');
var fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const Users = require('../models/User');
const Blog = require('../models/Blog');
const { body, validationResult } = require('express-validator');

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let totalBlogs = 0;
  
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
    body('content', 'content must be atleast 100 characters').isLength({ min: 100 }),
    body('inbrief', 'inbrief must be atleast 20 characters').isLength({ min: 20 }),
    body('author', 'author must be atleast 2 characters').isLength({ min: 2 }),
    body('tag', 'tag must be atleast 5 characters').isLength({ min: 5 }),
    body('category', 'category must be atleast 2 characters').isLength({ min: 2 })
], async (req, res) => {
    try {


        const { title, content, tag, inbrief, author,category } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const blog = new Blog({
            title, content, tag, user: req.user.id, inbrief, author, category
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
    const { title, content, tag, inbrief, author,category } = req.body;
    try {
        // Create a newBlog object
        const newBlog = {};
        if (title) { newBlog.title = title };
        if (content) { newBlog.content = content };
        if (tag) { newBlog.tag = tag };
        if (inbrief) { newBlog.inbrief = inbrief };
        if (author) { newBlog.author = author };
        if (category) { newBlog.category = category };

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


router.get("/blogsByAuthorId/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const blogs = await Blog.find({ user: id });
      res.json({ Blogs: blogs });
    } catch (error) {
      res.json({ err: error });
    }
  });
  router.get("/categorycount", async (req, res) => {
    try {
      const blockchain = await Blog.find({ category: "Blockchain" });
      const fashion = await Blog.find({ category: "Fashion" });
      const technology = await Blog.find({ category: "Technology" });
      const Business = await Blog.find({ category: "Business" });
      const health = await Blog.find({ category: "Health" });
      const fitness = await Blog.find({ category: "Fitness" });
      const javascript = await Blog.find({ category: "javascript" });
      res.json({
        blockchain: blockchain.length,
        fashion: fashion.length,
        technology: technology.length,
        business: Business.length,
        health: health.length,
        fitness: fitness.length,
        javascript: javascript.length,
      });
    } catch (error) {
      res.json(error);
    }
  });
  router.get("/category/:category", async (req, res) => {
    const { category } = req.params;
  
    try {
   
      const blogs = await Blog.find({ category: category });
  
      if (blogs) {
        // Create an object containing both arrays
        res.json(blogs);
      } else {
        res.json({ message: "No Blogs Available" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  router.get("/blogscount", (req, res) => {
    Blog.count(function (err, count) {
      if (err) res.send(err);
      res.json({ count: count });
    });
  });

  router.get("/search/title?", async (req, res) => {
    const { q } = req.query; // Extract the "q" query parameter from the request
  
    try {
      // Use the Mongoose model "Blog" to search for blogs
      const blogs = await Blog.find({ title: { $regex: q, $options: "i" } });
      
      // Send a JSON response containing the search results
      res.json(blogs);
    } catch (error) {
      // Handle any errors that occur during the search
      res.json(error);
    }
  });

 router.get("/search/category?", async (req, res) => {
  const { q } = req.query; // Extract the "q" query parameter from the request

  try {
    // Use the Mongoose model "Blog" to search for blogs
    const blogs = await Blog.find({ category: { $regex: q, $options: "i" } });
    
    // Send a JSON response containing the search results
    res.json(blogs);
  } catch (error) {
    // Handle any errors that occur during the search
    res.json(error);
  }
});
router.get("/search/tag?", async (req, res) => {
    const { q } = req.query; // Extract the "q" query parameter from the request
  
    try {
      // Use the Mongoose model "Blog" to search for blogs
      const blogs = await Blog.find({ tag: { $regex: q, $options: "i" } });
      
      // Send a JSON response containing the search results
      res.json(blogs);
    } catch (error) {
      // Handle any errors that occur during the search
      res.json(error);
    }
  });


  router.patch("/bookmarks/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const blog = await Blog.findOne({ _id: id });
    const user = await Users.findOne({ _id: userId });
    if (user) {
      try {
        if (!user.bookmarks.includes(id)) {
          await user.updateOne({ $push: { bookmarks: id } });
          res.json("Bookmarked");
        } else {
          res.json("already Bookmarked");
        }
      } catch (error) {}
    }
  });
//   router.patch("/bookmark/:id", async (req, res) => {
//     const { id } = req.params;
    // const { userId } = req.body;
    // blog.user.toString() !== req.user.id
    // console.log(id, req.user.id);
    // const blog = await Blog.findOne({ _id: id });
    // const user = await Users.findOne({ _id: userId });
    // if (user) {
    //   try {
    //     if (!user.bookmarks.includes(id)) {
    //       await user.updateOne({ $push: { bookmarks: id } });
    //       res.json("Bookmarked");
    //     } else {
    //       res.json("already Bookmarked");
    //     }
    //   } catch (error) {}
    // }
//   });
  router.patch("/unbookmark/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const blog = await Blog.findOne({ _id: id });
    const user = await Users.findOne({ _id: userId });
    if (user) {
      try {
        if (user.bookmarks.includes(id)) {
          await user.updateOne({ $pull: { bookmarks: id } });
          res.json("unbookmarked");
        } else {
          res.json("bookmark first");
        }
      } catch (error) {}
    }
  });
  router.patch("/like/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const blog = await Blog.findOne({ _id: id });
    if (blog) {
      if (!blog.likes.includes(userId)) {
        await blog.updateOne({ $push: { likes: userId } });
        res.json("Liked");
      } else {
        res.json("You already liked it");
      }
    } else {
      res.json("No blogs found");
    }
  });
  router.patch("/unlike/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const blog = await Blog.findOne({ _id: id });
    if (blog) {
      if (blog.likes.includes(userId)) {
        await blog.updateOne({ $pull: { likes: userId } });
        res.json("unliked");
      } else {
        res.json("You never liked it ");
      }
    } else {
      res.json("No blogs found");
    }
  });
  router.patch("/test", (req, res) => {
    console.log(req.body);
  });
module.exports = router;