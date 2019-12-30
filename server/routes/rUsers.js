const express = require('express');
const router = express.Router();
const { User } = require('../models/user')

const {auth} = require('../middleware/auth.js');


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.get('/', (req, res) => {
    res.json({
        "hello": "I am happy to deploy our app"
    })
})


// Register new users endpoint
router.post("/register", (req, res) => {
    const user = new User(req.body);
    console.log(user)
    user.save((err, doc) => {
        if(err) return res.send(err);
        return res.status(200).json({
            success: true
        });
    });
});

// Login users
router.post('/login', (req, res) => {

    // find the users email
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "Login failed, email not found"
            })
        }

        // compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "Login failed, wrong password"
                });
            }

            // Generate token
            user.generateToken((err, user) => {
                if(err) {
                    return res.status(400).send(err);
                }

                res.cookie("w_authExp", user.tokenExp);
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })
})

// Logout endpoint
router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: "", tokenExp: ""}, (err, doc) => {
        if(err){
            return res.json({
                success: false,
                error: err
            })
        }
        return res.status(200).send({
            success: true
        })
    })
})

module.exports = router