const express = require('express');
var bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const router = express.Router();
var jwt = require('jsonwebtoken');
// router.use(express.json());
var fetchuser=require('../middleware/fetchuser')
const JWT_SECRET = "Harryisagoodguy";

//create a user using: POST "/api/auth/createuser".

router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
    body('registration', 'enter a valid registration number').isLength({ min: 14 }),
    
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        let user = await User.findOne({ registration: req.body.registration });
        let registration=await User.findOne({ email: req.body.email });
        if (user || registration) {
            return res.status(400).json({success, error: "email/registration already exists" })
        }
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            university:req.body.university,
            degree:req.body.degree,
            major:req.body.major,
            registration:req.body.registration,
            skills:req.body.skills,
            github:req.body.github,
            about_yourself:req.body.about_yourself
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success,authToken})
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
})


//authenticate a user using: POST "/api/auth/login".
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password can not be blank').exists()
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user= await User.findOne({email});
        if (!user) {
            return res.status(400).json({success, error: "pls write correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false;
            return res.status(400).json({ success,error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }

        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken)
        success=true;
        res.json({success,authToken})
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server error' });
    }


});
router.post('/getuser', fetchuser, async (req, res) => {
try {
    userId= req.user.id;
    const user =await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server error' });
}
});
module.exports = router;