var app = require('express')()
	, http = require('http').Server(app)
	,io = require('socket.io')(http)
	,express = require('express')
	, path = require('path')
	, easyimg = require('easyimage')
	, sqlite3 = require('sqlite3').verbose()
	, db = new sqlite3.Database('./database/database.db')
  ,bodyParser = require('body-parser') // for reading POSTed form data into `req.body`
  ,expressSession = require('express-session')
  ,cookieParser = require('cookie-parser');
  
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(cookieParser());
  app.use(expressSession({secret:'somesecrettokenhere'}));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({  
    keepExtensions: true, 
    uploadDir: __dirname + '/public/fotos-boda',
    limit: '1000mb'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', function(req, res){
if (req.session.userName) {
    var username
  }
  var consulta ="SELECT rowid AS id,id_usuario,imagen,type FROM fotos";
  db.serialize(function() {
    db.all(consulta, function(err, row) {
            res.render('home2', {'name': row,usuario:username});
      console.log(row)
    });
   });
});
app.post('/', function(req, res) {
  db.serialize(function() {
  var stmt = db.prepare("INSERT INTO fotos VALUES (?,?,?)");
      var nombre = req.body.myName;
  if(req.files.myFile.path!=null){
      var elpath = req.files.myFile.path,
          upFoto = elpath.split("/");
          upFoto = upFoto[upFoto.length-1];
      var type = upFoto.split(".");
          type = type[type.length-1];
          stmt.run(nombre,upFoto,type);
          crop(elpath,upFoto,nombre,type);
  }else{
         var ft=req.files.myFile.length
         var i=0;
     while ( i < ft) {
      var elpath = req.files.myFile[i].path,
          upFoto = elpath.split("/");
          upFoto = upFoto[upFoto.length-1];
      var type = upFoto.split(".");
          type = type[type.length-1];
          stmt.run(nombre,upFoto,type);
          crop(elpath,upFoto,nombre,type);
      i++;
   } 
  }
  stmt.finalize();
  });
  res.end();
});
var crop = function(elpath,upFoto,nombre,type){
  easyimg.rescrop({
         src:elpath, dst:__dirname + '/public/thumbnail/'+upFoto,
         width:500, height:500,
         cropwidth:250, cropheight:250,
         x:0, y:0
      }).then(
      function(image) {
         console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
         io.emit('message', {'nombre':nombre,'upFoto':upFoto,'type':type});
      },
      function (err) {
        console.log(err);
      }
    );
  }


 http.listen(3030, function(){
  console.log('listening on */chat');
 });
