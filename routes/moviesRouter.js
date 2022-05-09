const express = require('express');
const FavMovieModel = require('../models/FavMovieModel');
const userModel = require('../models/userModel');
const moviesRouter = express.Router();
const { protectRoute } = require('./utilfns')

moviesRouter.use(protectRoute);
moviesRouter
    .route('/')
    .get(protectRoute, getMovies);
moviesRouter
    .route('/')
    .post(protectRoute, createMovies);
moviesRouter
    .route('/updaterating/:id')
    .post(protectRoute, updaterating);

async function updaterating(req, res) {
    let { id } = req.params;
    console.log("id is-------- :", id);
    try {
        // let templateID= JSON.parse(id);
        if (req.body.rating <= 5) {
            let updatedRating = await FavMovieModel.findByIdAndUpdate(id, {
                $push: { rating: req.body.rating }
            }, { new: true });
            // console.log(updatedRating);
            res.status(200).json({
                message: "rating updated successfully",
                updatedRating: updatedRating
            })
        } else {
            res.status(500).json({
                message: "invalid rating"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err,
            message: "cannot update please try again later!"
        })
    }
}
async function createMovies(req, res) {

    try {
        let movie = await FavMovieModel.create({
            movies: req.body.movies,
            rating: req.body.rating,
            user: req.user
        });
        let movieId = movie["_id"];
        let userID = req.user._id
        let user = await userModel.findById(userID);
        user.FavoriteMovieList.push(movieId);
        let userupdate = await user.save();
        // let ratings
        res.status(200).json({
            message: "favorite movie added",
            movies: movie,
            userupdate: userupdate
        })
    } catch (err) {
        res.json({
            error: err
        })
    }



}

async function getMovies(req, res) {
    let { search } = req.query
    console.log(search);
    try {
        if (req.query.search) {
            // let searchedResult = await FavMovieModel.find(
            // {movies:{$regex: search, $options: 'i'}});
            let finalAvg = await FavMovieModel.aggregate([
                { $match: { movies: { $regex: search, $options: 'i' } } },

                {
                    $project: {
                        _id: 0, ratings: {
                            $slice: ['$rating', -1]
                        }
                    },
                },
            ])
            var sum = 0;
            for (var key in finalAvg) {
                   sum +=finalAvg[key].ratings[0];
            }
            finalAvgrating = sum/finalAvg.length
            return res.json({
                message: `search result for ${search}`,
                finalAvg: finalAvgrating,
            })
        }
        let movies = await FavMovieModel.find();
        res.status(200).json({
            "message": movies
        })

    } catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}



module.exports = moviesRouter;