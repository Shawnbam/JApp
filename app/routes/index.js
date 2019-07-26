var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = require('../app');
var multer = require('multer');
let Post = require('../models/post')
let User = require('../models/user')

const path = require('path').join(__dirname, `../public/images/userPosts/`);
const upath = require('path').join(__dirname, `../public/images/users/`);
var upload = multer({ dest: path })
let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true})
.then(() => console.log('Connected...'))
.catch((err) => console.log('error...', err));


router.get('/user', (req, res) => {
  let user = new User({
      _id: "me@gmail.com",
      firstname: "String",
      lastname: "me",
      photo: "",
      password: "me1",
      emailid: "me@gmail.com",
      posts: ['kuchbhi'], // array of post_id
      likes: []// array of post_id
    });
    user.save();
    
});

router.post('/', upload.single('img'), function(req, res) {
  {
      // let user = new User({
      //   _id: "me@gmail.com",
      //   firstname: "String",
      //   lastname: "me",
      //   photo: "",
      //   password: "me1",
      //   emailid: "me@gmail.com",
      //   posts: ['kuchbhi'], // array of post_id
      //   likes: []// array of post_id
      // });
      // user.save();
  }
  doit(req, res);
});
async function doit(req, res, callback){
  try
  {  
    let post = new Post({
      userid: req.body.userid,
      photo: path + req.file.filename,
      likes: [], // array of user_id
      caption: req.body.caption,
      created: req.body.created,
      lastupdated: req.body.lastupdated,
    })
    const c = await post.save();
    const aw =  await User.findByIdAndUpdate(c.userid,
      { "$push": { "posts": c._id } }).then(res.status(200).send(c+'as'));
    
    console.log('hey ', c._id)
    // res.status(500).send(err);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
}



router.get('/:name', async (req, res) => {  
  try{
    let a = await Post.findById(req.params.name);
    res.status(200).send(a);
  }
  catch(err){
    console.log(err);
  }
});


router.get('/delete/:name', async (req, res) => {  
  try{
    let post = await Post.findById(req.params.name);
    fs.unlinkSync(post.photo);
    const del = await Post.deleteOne({_id: req.params.name});
    
    if(del.deletedCount === 1)
      res.status(200).send('deleted');
    else
      res.status(404).send('file not found');
  }
  catch(err){
    res.status(500).send('error occured');
    console.log(err);
  }
});

router.post('/postlike', upload.none(), async function(req, res){
  try{
    console.log(req.body.postid);
    let postupd =  await Post.findByIdAndUpdate(req.body.postid,
      { "$push": { "likes": req.body.userid } });
    let userupd =  await User.findByIdAndUpdate(req.body.userid,
      { "$push": { "likes": req.body.postid } });
    // let post = await Post.findById(req.body.postid);
    // let user = await User.findById(req.body.userid);
    // Post.count({_id: req.body.postid, posts },async (err, count)=> {
    //   if(count > 0){
    //   }
    //   else{
    //     // let postupd =  await Post.findByIdAndUpdate(req.body.postid,
    //     //   { "$push": { "likes": req.body.userid } });
    //     // let userupd =  await User.findByIdAndUpdate(req.body.userid,
    //     //   { "$push": { "likes": req.body.userid } });
    //   }
    // })
    
    res.status(200).send('liked');
    // if(del.deletedCount === 1)
    //   res.status(200).send('deleted');
    // else
    //   res.status(404).send('file not found');
  }
  catch(err){
    res.status(500).send('error occured');
    console.log(err);
  }
  res.status(200);
});


router.get('', function(res, req){

});


module.exports = router;
