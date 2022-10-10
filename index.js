const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Signup = require('./models/Signup')
const RentalPost = require('./models/Rentals')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString + file.originalname);
    }
})

const upload = multer({ storage: storage })

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

let session = false;
let user_id;
let user_fullname;









function monitoring(name_route, route_redirect, res) {
    if (session) {
        Signup.findById(user_id).then(result => {
            res.render(name_route, { session, result });
        })
    }
    else {
        res.redirect(route_redirect);
    }
}


//route for the homepage
app.get('/', async (req, res) => {
    const file = await RentalPost.find({})
    res.render('index', { session, file, user_id });

})


//added new user (Sign up form)
app.post('/signup', async (req, res) => {
    const { fullname, email, pwd } = req.body;
    const result = await Signup.findOne({ email: email })
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
                user_id = newuser.id;
                res.redirect('/');
            })
            .catch(err => {
                console.log("Failed to enter new user");
                console.log(err);
            })
    }
    else {
        res.send("Email Data Found")
    }
})



//Sign in Fomm
app.post('/signin', (req, res) => {
    const { sign_email, sign_pwd } = req.body;
    const signIn = Signup.find({ $and: [{ email: sign_email, pwd: sign_pwd }] }).then(function (data, i) {
        if (data.length != 0) {
            session = true;
            user_id =data[0]._id;
            res.redirect('/');
        }
        else {
            session = false;
            res.redirect('/');
        }

    });
});

//logout  form

app.post('/logout', (req, res) => {
    session = false;
    res.redirect('/');
})


//added new apartment // image not working right now
app.post('/rental', upload.single('rentalImage'), (req, res) => {
    const { rentalImage, fullname, price, description, address, lat, long } = req.body;
    const newpost = new RentalPost({
        rentalImage: rentalImage,
        fullname: fullname,
        price: price,
        description: description,
        address: address,
        lat: lat,
        long: long
    });
    newpost.save()
        .then(data => {
            console.log("Successfully Created a new user");
            console.log(data);
            res.redirect('/profile');
        })
        .catch(err => {
            console.log("Failed to enter new user");
            console.log(err);
        })


})





//route for the rental page // need id only to find the id from the database //
app.get('/rental/:post_id', async (req, res) => {
    const { post_id } = req.params;
    const postresult = await RentalPost.findById(post_id);
    res.render('rental', { session, postresult, user_id});


})

//comment in review
app.post('/comment/:post_id', async (req, res) => {
    const { post_id } = req.params;
    const {review} = req.body;
    const commentresult = await Signup.findById(user_id);
    const postresult = await RentalPost.findById(post_id);
    postresult.comments.push({
        commentid : user_id,
        commentreview: review,
        namecomment: commentresult.fullname,
     })
     
     postresult.save().then
     res.render('rental', { session, postresult, user_id});
})



//route for the profile page
app.get('/profile', (req, res) => {
    monitoring('profile', '/', res)
})


//post page 
app.get('/post', (req, res) => {
    monitoring('post', '/', res)
})



//this is the port where we can listen, port: 8080
app.listen(8080, () => {
    console.log("listening on port 8080");
})