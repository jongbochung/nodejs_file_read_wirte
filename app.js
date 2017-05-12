var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.locals.pretty = true;

app.set('veiws', './views');
app.set('view engine', 'jade');

app.get('/home/new', function(req, res){
  fs.readdir('data', function(err, files){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('new', {homes:files});
    });
});
app.get(['/home', '/home/:id'], function(req, res){
    fs.readdir('data', function(err, files){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id){
          fs.readFile('data/'+id, 'utf-8', function(err, data){
            if(err){
              console.log(err);
              res.status(500).send('Internal Server Error');
            }
            res.render('view', {homes:files, title:id, description:data});
          })
        } else{
          res.render('view', {homes:files, title:'', description:''});
        }
    })
})
app.post('/home', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
        if(err) {
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/home/'+title);
    });
})

app.listen(3000, function(){
    console.log('Connected....');
})
