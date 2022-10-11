const mongoose = require('mongoose');

const rentalPostSchema = new mongoose.Schema({
    rentalImage: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    }
    ,
    lat: {
        type: mongoose.Decimal128,
        require: true
    },
    long: {
        type: mongoose.Decimal128,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user_postid: {
        type: String,
        require: true
    },
    comments: [{
        commentid: {type:String},
        commentreview : {type:String},
        namecomment: {type:String}
        }
    ]


})

const RentalPost = mongoose.model('RentalPost', rentalPostSchema);

module.exports = RentalPost;
