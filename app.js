require("dotenv").config()
const express = require('express');
const session = require('express-session');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ejs = require('ejs');
const path = require('path');
const {connectMongoDB} = require('./connection');
const User = require('./models/user')
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

app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:true,
    cookie: {secure:false},
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:process.env.CALLBACKURL,
},function verify(accessToken,refreshToken,profile,cb){
    //check if user already exit
    User.findOne({ProfileId:profile.id}).then((currentUser)=>{
        if(currentUser){
            //already have the user
            console.log('currentUser is',currentUser);
        }else{
            // if not , create new user
            new User({
                username:profile.displayName,
                ProfileId:profile.id,
                email:profile.emails[0].value,
                issuer:profile.provider,
               }).save().then((newUser)=>{
                console.log(`newuser created: ${newUser}`)
               })
        }
    })
    cb(null,profile);
}));

passport.serializeUser(function(user,cb){
    cb(null,user);
})

passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})

// app.use(express.static(path.join(__dirname,"public")));

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.get('/dashboard',(req,res)=>{    
    if(req.isAuthenticated()){
        console.log(req.user);
     return  res.render('dashboard.ejs',{user:req.user}),
        {user:req.user}
    }
    return res.redirect('/login');
})

app.get('/auth/google',passport.authenticate('google',{scope:["profile","email"]})
);


app.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect:'/login',
}),async(req,res)=>{
   return res.redirect('/dashboard')
})

app.get('/logout',(req,res)=>{
    req.logOut(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
})


app.listen(8000,()=>{
    console.log(`server is running on port 8000`) 
})