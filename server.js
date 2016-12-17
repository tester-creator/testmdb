 const express = require('express');
 const bodyParser= require('body-parser');
 const MongoClient = require('mongodb').MongoClient;
 const imdb = require('imdb-api');
 const app = express();

app.use(bodyParser.urlencoded({extended:true}))

var db;
MongoClient.connect('mongodb://localhost/test2',(err,database)=>{
  if(err) return console.log(err)
  db=database;
  app.listen(3000,function() {
    console.log('listing on 3000');

  })

})

app.set('view engine','ejs');

app.get('/',(req,res) => {
db.collection('mIYs').find().toArray((err,result)=>{
  if(err) return console.log(err);
  res.render('index.ejs',{ mIYs: result})
})

})

app.post('/movieInfo',(req,res)=>{
  db.collection('mIYs').save(req.body,(err,result)=>{
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  })
  var movie;
  imdb.getReq({ name:req.body.movieName  }, function(err, things) {
     if (err) return console.log('movie not found');
      movie = things;
      db.collection('movies').save(movie,(err,result)=>{
        if (err) return console.log(err);
        db.collection('movies').findOneAndUpdate({title:req.body.movieName},{
          $set:{
            youtubeLink:req.body.YId
          }})
        console.log('movie info saved to database');
        console.log(movie);
      })
  });


})
