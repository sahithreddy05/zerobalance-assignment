const express = require('express'); 
const bodyParser = require('body-parser');
const session = require('express-session');  
const passport = require('passport');  
const userRouter = require('./routes/userRoute');
const moviesRouter = require('./routes/moviesRouter');
const app = express();
const {protectRoute} = require('./routes/utilfns')
const { SESSION_SECRET_KEY} = require('./secrets');

app.use(express.json());
app.use(session({
    secret:  SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// apis
app.use('/api/user', userRouter)
app.use('/api/movies',moviesRouter)


app.get('/',protectRoute, (req, res) => {
    res.json({
        message:req.user
    })
})
// app.get('/', (req, res) => {
//     console.log(req.user);
//     res.send('<h1>Hi</h1>')
// })


const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
