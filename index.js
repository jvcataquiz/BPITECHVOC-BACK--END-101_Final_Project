const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Signup = require('./models/Signup')
const RentalPost = require('./models/Rentals')
const multer = require('multer');
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use('/uploads', express.static('uploads'));

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '__' + file.originalname.toLowerCase());
    }
})
const upload = multer({ storage: filestorage, limits: { fieldSize: 10 * 1024 * 1024 } });

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









//route for the homepage
app.get('/', async (req, res) => {
    const file = await RentalPost.find({})
    const result = await Signup.findById(user_id);
    res.render('index', { session, file, result, user_id });

})


//added new user (Sign up form)
app.post('/signup', async (req, res) => {
    try {
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
                    errormsg = "";
                })
                .catch(err => {
                    console.log("Failed to enter new user");
                    console.log(err);
                })
        }
        else {


            res.redirect('/');
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
            user_id = data[0]._id;
          
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
app.post('/rental', upload.single("rentalImage"), (req, res) => {
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
        res.render('rental', { session, postresult, user_id });
    }
    catch (e) {
        res.render('404', { session, user_id });
    }
})

//comment in review
app.post('/comment/:post_id', async (req, res) => {
    try {
        const { post_id } = req.params;
        const { review } = req.body;
        const commentresult = await Signup.findById(user_id);
        const postresult = await RentalPost.findById(post_id);
        postresult.comments.push({
            commentid: user_id,
            commentreview: review,
            namecomment: commentresult.fullname,
        })

        postresult.save().then
        res.render('rental', { session, postresult, user_id });
    }
    catch (e) {
        res.render('404', { session, user_id });
    }
})



//route for the profile page
app.get('/profile', async(req, res) => {
    if (session) {
        const result = await Signup.findById(user_id);
        const datas = await RentalPost.find({"user_postid":user_id});
        res.render('profile',{ session, result, datas });
    }
    else {
        res.redirect('/');
    }
})


// update operation for the apartment
app.get('/updaterental/:id', async (req, res) => {
    const {id} = req.params;
    if (session) {
        const output = await RentalPost.findById(id);
        res.render('update', { output, session });
    }
    else {
        res.redirect('/');
    }
})

//delete operation for the apartment
app.delete('/rental/:id', async (req, res) => {
    const { id } = req.params;
    const deletePost = await RentalPost.findByIdAndDelete(id);
    res.redirect('/profile');
})

//update info
app.patch('/update-user/:id', async (req, res) => {
    const { id, postid } = req.params;
    const { fullname, pwd } = req.body;
    const product = await Signup.findByIdAndUpdate(id, {
        fullname: fullname,
        pwd: pwd
    });
    const nameupdate = await RentalPost.findOneAndUpdate({ "user_postid": id }, {
        fullname: fullname
    });
    res.redirect('/profile');
})



//update rental
app.put('/updateinfo/:id', upload.single("rentalImage"), async( req, res) => {
  
    const  {postid, fullname, price, description, address, lat, long } = req.body;
    if (req.file) {
        const nameupdate =  await RentalPost.findByIdAndUpdate(postid, {
            rentalImage: req.file.path,
            fullname: fullname,
            price: price,
            description: description,
            address: address,
            lat: lat,
            long: long,
            user_postid: user_id
        });
      
    }
    else {
        const nameupdate = await RentalPost.findByIdAndUpdate(postid, {
            
            fullname: fullname,
            price: price,
            description: description,
            address: address,
            lat: lat,
            long: long,
            user_postid: user_id
        });
       
    }
  
    res.redirect(`/updaterental/${postid}`);

})


delete comment
app.put("/commentdelete/:userid/:id", (req, res) => {

    const { userid, id } = req.params;
    const postresult = RentalPost.findOneAndUpdate({_id: userid}, {$pull:{ commnents: { _id: id } } }, function(err, data){
        console.log(data);

    })
    // console.log(postresult);
   
    RentalPost.findOneAndUpdate(
        { _id : userid},
        { $pull: { comments: { _id: id } } },
        { new: true }
      )
        .then(templates =>  res.redirect(`/rental/${userid}`))
        .catch(err =>  res.redirect('/'));
    // Users.findOneAndUpdate({ _id: "myId" }, { $pull: { connections.sessions: { device: "mobile" } } }, { new: true });
   
})




//post page 
app.get('/post',async(req, res) => {
    if (session) {
        const result = await Signup.findById(user_id);
        const datas = await RentalPost.find({"user_postid":user_id});
        res.render('post',{ session, result, datas });
    }
    else {
        res.redirect('/');
    }
})



//404 page 
app.get('*', (req, res) => {
    res.render('404', { session, user_id });
})

//this is the port where we can listen, port: 8080
app.listen(8080, () => {
    console.log("listening on port 8080");
})