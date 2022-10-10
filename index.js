const express = require('express');
const app = express();
const path = require('path');
const file = require('./data.json');
const mongoose = require('mongoose');
const { Sign } = require('crypto');

//to deserialize json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//connection to open mongooose
mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("error");
        console.log(err);
    });









//using ejs package
app.set("view engine", "ejs");
// path for css ,js , image 
app.use(express.static(path.join(__dirname, '/public')));
//path for templating, this is for the pages
app.set('views', path.join(__dirname, '/views'));


const signUpSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    pwd: {
        type: String,
        require: true
    }
})
const Signup = mongoose.model('Signup', signUpSchema);













//fake session
let session = false;
let user_id ; 

//route for the homepage
app.get('/', (req, res) => {
    res.render('index', { session, file });
})

app.get('/try', (req, res) => {
    res.render('try');
})


//route for the rental page // need id only to find the id from the database //
app.get('/rental/:address/:lat/:long/:id', (req, res) => {
    const { address, lat, long, id } = req.params;
    res.render('rental', { session, address, lat, long, id });
})

//added new apartment
app.post('/rental', (req, res) => {
    res.redirect('/profile');
})

//route for the profile page
app.get('/profile', (req, res) => {
    if (session) {
        res.render('profile', { session , user_id});
    }
    else {
        res.redirect('/');
    }

})

//post page
app.get('/post', (req, res) => {
    if (session) {
        res.render('post', { session });
    }
    else {
        res.redirect('/');
    }

})



//added new user (Sign up form)
app.post('/signup', (req, res) => {
    const { fullname, email, pwd } = req.body;
    Signup.findOne({ email: email })
        .then(result => {
            if (result === null) {
                const newuser = new Signup({
                    fullname: fullname,
                    email: email,
                    pwd: pwd
                });
                newuser.save()
                    .then(data => {
                        console.log("Successfully Created a new user");
                        console.log(data);
                        user_id  = newuser.id;
                        session = true;
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log("Failed to enter new user");
                        console.log(err);
                        session = false;
                    })
            }
            else {
                res.send("Email Data Found")
            }
        })
})

//Sign in Fomm
app.post('/signin', (req, res) => {
    const { sign_email, sign_pwd } = req.body;
    Signup.find({$and:[{ email: sign_email ,  pwd: sign_pwd}]})
        .then(result => {
            if (result.length != 0) {
               console.log("Welcome !!");
            }
            else {
                res.send("no data found")
            }
        })
})


//this is the port where we can listen, port: 8080
app.listen(8080, () => {
    console.log("listening on port 8080");
})