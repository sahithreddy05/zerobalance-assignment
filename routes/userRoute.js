const express = require('express');

const userRouter = express.Router();
const passport = require('passport');  // authentication
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../secrets');



passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

userRouter.post('/signup', signupUser)
userRouter.post('/login', loginUser);
userRouter.get("/logout", logOut);
userRouter.get("/", getUsers);

async function getUsers(req, res) {
    let user = await userModel.find();
    res.status(200).json({
        message:"users",
        user:user
    })
}
async function logOut(req, res) {
    await req.logout();
    res.json({ message: "logged out" });
};



async function signupUser(req, res) {
    // let user = new userModel({ name: req.body.name, email: req.body.email,age:req.body.age })
    let user = new userModel(req.body);
    userModel.register(user, req.body.password, function (err, user) {
        if (err) {

            res.json({ success: false, message: "Your account could not be saved. Error: ", err })

        } else {
            res.json({ success: true, message: "Your account has been saved" })
        }
    })
}

async function loginUser(req, res) {

    if (!req.body.email) {

        res.json({ success: false, message: "Username was not given" })

    } else {

        if (!req.body.password) {

            res.json({ success: false, message: "Password was not given" })

        } else {
            // console.log(req.body.email);
            // console.log(req.body.password);
            passport.authenticate('local', function (err, user, info) {
                console.log(user);
                if (!user) {
                    res.json({ success: false, message: 'username or password incorrect', info: info })
                } else {
                    req.login(user, function (err) {
                        if (err) {
                            res.json({ success: false, message: err })
                        } else {
                            // const token = jwt.sign({
                            //     userId: user._id,
                            //     email: user.email
                            // }, JWT_SECRET,
                            //     { expiresIn: '1h' })
                            // res.json({
                            //     user:user, success: true, message: "Authentication successful", token: token
                            // });
                            res.json({
                                user: user._id, user_name: user.name, success: true, message: "Authentication successful",
                            })
                        }
                    })
                }
            })(req, res);
        }
    }
}


// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next();
//     }

//     return res.send('not authorized');
//   }


module.exports = userRouter