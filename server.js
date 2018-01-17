var express                 = require('express');
var passport                = require('passport');
var ejs                     = require('ejs');
var bodyParser              = require('body-parser');
var localStrategy           = require('passport-local');
var User                    = require('./app/models/user');
var passportLocalMongoose   = require('passport-local-mongoose');
var mongoose                = require('mongoose');

mongoose.connect('mongodb://joselee:joselee@ds259117.mlab.com:59117/fcc-github-auth');
var app = express();

app.set('view engine','ejs');
app.use(require('express-session')({
  secret:'I have a son and two daughters',
  resave:false,
  saveUninitialized:false
}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get('/',(req,res)=>{
   res.render('home',{cont:'Welcome to the home page'});
});

app.get('/secret',isLoggedIn,(req,res)=>{
     res.render('secret',{cont:'Welcome to the secret page',id:req.user._id});
});

app.get('/register',(req,res)=>{
   res.render('register',{cont:'Welcome to the Registration page'});
});

app.post('/register',(req,res)=>{
   const { username, password } = req.body;
   
   User.register(new User({username:username}),password,(err,user)=>{
      if(err) throw err

      passport.authenticate('local')(req,res,()=>{
          res.redirect('/secret');
      });
   });
});

app.get('/login',(req,res)=>{
   res.render('login',{cont:'Welcome to Login page'});
});

app.post('/login',passport.authenticate('local',{
    successRedirect:'/secret',
    failureRedirect:'/login'
  }),(req,res)=>{
   
});

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
});

function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
     return next();
   }
   res.redirect('/login');
}

var port = process.env.PORT || 8989;
app.listen(port, ()=>{
 console.log("app started on port "+ port)
})
