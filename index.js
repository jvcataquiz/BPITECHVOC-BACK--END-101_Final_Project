const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Signup = require('./models/Signup')
const RentalPost = require('./models/Rentals')
const multer = require('multer');


app.use('/uploads', express.static('uploads'));

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) =>  {
        cb(null, Date.now() +'__' + file.originalname.toLowerCase());
    }
})
const upload = multer({ storage:filestorage, limits: { fieldSize: 10 * 1024 * 1024 } });

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

       const result=  Signup.findById(user_id).then(result => {
        RentalPost.find({user_postid: user_id}).then(datas=> {
            res.render(name_route, { session, result, datas });
        })
           
        })
    }
    else {
        res.redirect(route_redirect);
    }
}


//route for the homepage
app.get('/', async (req, res) => {
    const file = await RentalPost.find({})
    const result=  await Signup.findById(user_id);
    console.log(file.rentalImage);
    res.render('index', { session, file, result, user_id});

})


//added new user (Sign up form)
app.post('/signup', async (req, res) => {
    try{
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
}
catch (e) {
   res.send("404");
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
app.post('/rental',upload.single("rentalImage"),(req, res) => {
    const { fullname, price, description, address, lat, long } = req.body;
    const newpost = new RentalPost({
        rentalImage: req.file.path,
        fullname: fullname,
        price: price,
        description: description,
        address: address,
        lat: lat,
        long: long,
        user_postid: user_id
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
    try {
        const { post_id } = req.params;
        const postresult = await RentalPost.findById(post_id);
        console.log(postresult);
        res.render('rental', { session, postresult, user_id});
    }
    catch (e) {
       res.send("404");
    }
})

//comment in review
app.post('/comment/:post_id', async (req, res) => {
    try {
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
    }
    catch (e) {
       res.send("404");
    }
})



//route for the profile page
app.get('/profile', (req, res) => {
    monitoring('profile', '/', res)
})



//post page 
app.get('/post', (req, res) => {
    monitoring('post', '/', res)
})

app.get('*', (req, res)=>{
    res.redirect('/');
   })

//this is the port where we can listen, port: 8080
app.listen(8080, () => {
    console.log("listening on port 8080");
})