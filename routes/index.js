var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId  = require('mongodb').ObjectId;
//var date1  = require('mongodb').date;
var assert = require('assert');
var url = 'mongodb://localhost:27017/japp'
var dbb;
mongo.connect(url, function(err, db){
  dbb = db;
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/viewall', function(req, res, next) {
  var view = [];
  dbb.db('japp').collection('japp').find({}).toArray((err, result) => {
    // console.log(result);
    result.forEach(element => {
      view.push(element);
    });
    console.log(view);
    res.render('index', { view: view });
  });
});

router.post('/add', function(req, res, next) {
  console.log(req.body);
  dbb.db('japp').collection('japp').insert({name: req.body.name,
    desc: req.body.desc, date:Date()});
    console.log(Date.now());
  res.render('index', { add: 'Express' });
});
router.post('/update', function(req, res, next) {
  dbb.db('japp').collection('japp').findOne({name:req.body.name}, (err, result) => {
    if(result){
      console.log('data ', result.name);
      res.render('index', { data: result });
      return;
    }
    res.render('index', { msg: 'Some error occured try again' });
    return;
  });
});

router.post('/updateit', function(req, res, next) {
  console.log('idhar hu', req.body);  
  dbb.db('japp').collection('japp').updateOne({"_id":objectId(req.body.id)}, 
    {$set:{
      name: req.body.name,
      desc: req.body.desc,
      date: Date()
  }} , (err, result) => {
    console.log('result ', result);
    res.render('index');
  
  }
  );
});


router.get('/delete/:name', function(req, res, next) {  
  dbb.db('japp').collection('japp').remove({name: req.params.name});
  res.render('index');
});


router.post('/delete', function(req, res, next) { 
  res.redirect('/delete/' + req.body.name);
});




module.exports = router;
