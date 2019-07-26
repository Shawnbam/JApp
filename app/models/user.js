let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    _id: String,
    firstname: String,
    lastname: String,
    photo: String,
    password: String,
    emailid: String,
    posts: [], // array of post_id
    likes: []// array of post_id
})
module.exports = mongoose.model('User', userSchema)