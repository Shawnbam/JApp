let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    userid: String,
    photo: String,
    likes: [], // array of user_id
    caption: String,
    created: Date,
    lastupdated: Date,
})

module.exports = mongoose.model('Post', postSchema) 