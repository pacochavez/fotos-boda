var express = require('express')
  , http = require('http')
  , path = require('path')
  , easyimg = require('easyimage')
  , sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.Database('./database/database.db')
  , app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({  
    keepExtensions: true, 
    uploadDir: __dirname + '/public/fotos-boda',
    limit: '100mb'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});





app.get('/ver/:ids/', function(req, res) {
  var album =req.params.ids;
  if (album == 'fotos'){
    var consulta ="SELECT rowid AS id,album,imagen,type FROM fotos";
  }else if(album == 'albunes'){
    var consulta ="SELECT rowid AS id,album,imagen,type FROM fotos group by album";
  }
   db.serialize(function() {
    db.all(consulta, function(err, row) {
            res.render('galeria', { name: row,galeria:album});
      console.log(row)
    });
   });
});

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  db.serialize(function() {
  var stmt = db.prepare("INSERT INTO fotos VALUES (?,?,?)");
      var nombre = req.body.myName;
  if(req.files.myFile.path!=null){
   // console.log("una foto"+req.files.myFile.path)
      var elpath = req.files.myFile.path,
          upFoto = elpath.split("/");
          upFoto = upFoto[upFoto.length-1];
      var type = upFoto.split(".");
          type = type[type.length-1];
         // console.log(upFoto,nombre);   
          stmt.run(nombre,upFoto,type);
          easyimg.rescrop({
               src:elpath, dst:__dirname + '/public/thumbnail/'+upFoto,
               width:500, height:500,
               cropwidth:128, cropheight:128,
               x:0, y:0
            }).then(
            function(image) {
               console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
            },
            function (err) {
              console.log(err);
            }
          );
   
  }else{
  //  console.log("mas foto")
         var ft=req.files.myFile.length
         var i=0;
     while ( i < ft) {
      var elpath = req.files.myFile[i].path,
          upFoto = elpath.split("/");
          upFoto = upFoto[upFoto.length-1];
      var type = upFoto.split(".");
          type = type[type.length-1];
          //console.log(upFoto,nombre);   
          stmt.run(nombre,upFoto);
           easyimg.rescrop({
               src:elpath, dst:__dirname + '/public/thumbnail/'+upFoto,
               width:500, height:500,
               cropwidth:128, cropheight:128,
               x:0, y:0
            }).then(
            function(image) {
               console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
            },
            function (err) {
              console.log(err);
            }
          );
      i++;
   } 
  }
  stmt.finalize();
  //db.close();
  });
  res.end();
});

// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Private functions

var fs = require('fs');

var deleteAfterUpload = function(path) {
  setTimeout( function(){
    fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });
  }, 60 * 1000);
};
