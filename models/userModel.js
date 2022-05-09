const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('email-validator');
const { DB_PASSWORD } = require("../secrets.js");
let dblink = `mongodb+srv://root:${DB_PASSWORD}@cluster0.xjuvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose
    .connect(dblink)
    .then(function (connection) {
        console.log("db has been connected");
    }).catch(function (error) {
        console.log("err", error);
    })

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: function () {
                // third party library 
                return validator.validate(this.email)
            }
        },
        // password: {
        //     type: String,
        //     required: true,
        //     minlength: 8,
        // },
        age: {
            type: Number,
            min: 12,
            max: 100
        },
        FavoriteMovieList: {
            type: [mongoose.Schema.ObjectId],
            ref: "FavMovieModel",
        },
    })

userSchema.plugin(passportLocalMongoose,
    {
        usernameField:"email",
        maxAttempts:4,
        maxInterval:300000,
        limitAttempts:true
    })
let userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;