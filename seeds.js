const mongoose = require('mongoose');
const RentalPost = require('./models/Rentals')

mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err);
    })


// 
const seedRentals = [{
    rentalImage: "1665470885275__Capture.PNG",
    fullname: "Joshua Garcia",
    price: 2000,
    description:"Near in BGC, near all transpostation",
    address: "Manila, Philippines",
    lat:14.599512 ,
    long: 120.984222,
    date: Date.now(),
    comments: [{
        commentid: "63441941e5bc2610ee9d6421",
        commentreview : "How much?",
        namecomment: "Maria"
        }
        ,
        {
        commentid: "63441941e5bc2610ee9d6421",
        commentreview : "location?",
        namecomment: "Mario"
        }]
}
,
{
    rentalImage: "1665470885275__Capture.PNG",
    fullname: "Justin Bieber",
    price: 12000,
    description:"Near in BGC, near all transpostation",
    address: "Davao City, Philippines",
    lat:7.207573,
    long:125.395874,
    date: Date.now(),
    comments: [{
        commentid: "63441941e5bc2610ee9d6421",
        commentreview : "How much?",
        namecomment:  "Lando"
        }
        ,
        {
        commentid: "63441941e5bc2610ee9d6421",
        commentreview : "location?",
        namecomment: "Lino"
        }]
}

]

RentalPost.insertMany(seedRentals)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })