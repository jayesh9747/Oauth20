require("dotenv").config()
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const passport = require('passport')
const {connectMongoDB} = require('./connection');
const googleRouter = require('./controller/google-auth')
const facebookRouter = require('./controller/facebook-auth')
const staticRouter = require('./routes/staticRoutes');
const app = express();

app.set("view engine", "ejs");
app.set("veiws", path.resolve("./views"));

//mongoDB connection
connectMongoDB('mongodb://127.0.0.1:27017/GoogleAuth')
.then(
  console.log('MongoDB database is connected')
)
.catch(
  (error)=>{
  console.log(`MongoDB error:`,error);
  }
)

//middleware
app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:true,
    cookie: {secure:false},
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user,cb){
    cb(null,user);
})
passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})
app.use('/',staticRouter);
app.use('/',googleRouter);
app.use('/',facebookRouter);

app.listen(8000,()=>{
    console.log(`server is running on port 8000`) 
})