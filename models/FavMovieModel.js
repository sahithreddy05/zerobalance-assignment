const mongoose = require('mongoose');
const { DB_PASSWORD } = require("../secrets.js");
let dblink = `mongodb+srv://root:${DB_PASSWORD}@cluster0.xjuvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose
    .connect(dblink)
    .then(function (connection) {
        console.log("FavMovie db has been connected");
    }).catch(function (error) {
        console.log("err", error);
    })
const FavMovieSchema = new mongoose.Schema({
    movies: {
        type: String,
        required: true,
        // unique: true,
    },
    rating: {
        type: [Number],
        required:true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        // unique:true
    },
})

let FavMovieModel = mongoose.model("FavMovieModel", FavMovieSchema);

module.exports = FavMovieModel