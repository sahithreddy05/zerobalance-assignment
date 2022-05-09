const express = require('express'); 
const bodyParser = require('body-parser');
const session = require('express-session');  
const passport = require('passport');  
const userRouter = require('./routes/userRoute');
const moviesRouter = require('./routes/moviesRouter');
const app = express();
const {protectRoute} = require('./routes/utilfns')

app.use(express.json());
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
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
