const mongoose = require('mongoose');

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

module.exports = Signup;