const express = require('express');
const app = express();
const path = require('path');
const file = require('./data.json');
//using ejs package
app.set("view engine","ejs");
// path for css ,js , image 
app.use(express.static(path.join(__dirname, '/public')));
//path for templating, this is for the pages
app.set('views',path.join(__dirname, '/views'));


const session = true ;

//route for the homepage
app.get('/', (req, res)=>{
    res.render('index', {session,file});
   })

//route for the rental page
   app.get('/rental/:id', (req, res)=>{
    const {id}  = req.params;
    if(session){
        res.render('rental', {session,id});
    }
    else{
        res.redirect('/');
    }
   
   })


//this is the port where we can listen, port: 8080
app.listen(8080, () => {
    console.log("listening on port 8080");
})