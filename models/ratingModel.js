const mongoose = require('mongoose');
const { DB_PASSWORD } = require("../secrets.js");
let dblink = `mongodb+srv://root:${DB_PASSWORD}@cluster0.xjuvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose
    .connect(dblink)
    .then(function (connection) {
        console.log("rating db has been connected");
    }).catch(function (error) {
        console.log("err", error);
    })


const ratingSchema = new mongoose.Schema({
    rating: {
        type: [Number],
        min: 1,
        max: 5,
        required: true
    },  
})

let ratingModel = mongoose.model("ratingModel", ratingSchema);
module.exports = ratingModel;
