const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

const {checkCookie} = require('./middlewares/authentication');

const Post = require('./models/posts');

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 8001; 
const DB_URL = "mongodb+srv://admin:admin@cluster0.rpkl8gs.mongodb.net/Blog"

// mongodb connect
mongoose.connect(DB_URL)
.then(()=> console.log('DB connected'))
.catch((err)=> console.log('DB connection Error : \n',err));

// middleware for ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// middleware for form data
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser());
// middleware for check cookies
app.use(checkCookie("token")); 
// middleware for static
app.use(express.static(path.resolve('./public')));


app.get('/', async(req, res)=>{
    const allPosts = await Post.find({}).populate("createdBy").sort({ createdAt: -1 });
    res.render('home', {
        user : req.user,  
        allblogs : allPosts,
    }); 
}) 

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

app.listen(PORT, ()=> console.log(`Server Running on PORT : ${PORT}`));  