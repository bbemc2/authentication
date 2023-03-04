//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
// url = "mongodb+srv://" + process.env.API + "@cluster0.shflmal.mongodb.net/blogDB"
// local
url = 'mongodb://127.0.0.1:27017/secretDB'
mongoose.connect(url, 
{ useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    userName: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", async(req,res) => { try {
    const newUser = await new User({
        userName: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets");
    } catch (err){
        res.send(err);
    }
    });
    
app.post("/login", async(req,res) => { try {
    const newUser = await new User({
        userName: req.body.username,
        password: req.body.password
    });
    const foundUser = await User.findOne({userName: req.body.username});
    if (foundUser){
        if (foundUser.password === req.body.password){
            res.render("secrets");
        }
    } else{
        res.redirect("/login");
    }} catch (err){
        res.send(err);
    }
    });
    

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });