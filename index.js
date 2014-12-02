var app = require('express')()
  , http = require('http').Server(app)
  ,io = require('socket.io')(http)
  ,express = require('express')
  , path = require('path')
  , easyimg = require('easyimage')
  , sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.Database('./database/database.db')
  ,bodyParser = require('body-parser') // for reading postTed form data into `req.body`
  ,expressSession = require('express-session')
  ,cookieParser = require('cookie-parser')
  ,Users = {};
  
app.configure(function(){
 // app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(cookieParser());
  app.use(expressSession({secret:'321941239¿412¿342'}));
  app.use(express.favicon());
 // app.use(express.logger('dev'));
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
if (req.session.user_Id) {
    var id_usuario = req.session.user_Id;
    var username = req.session.user_Name;
    var avatar = req.session.avatar;
  }
  var consulta ="SELECT rowid AS id,id_usuario,imagen,type FROM fotos order by id desc";
  db.serialize(function() {
    db.all(consulta, function(err, row) {
            res.render('home2', {'name': row,'usuario':username,'id_usuario':id_usuario,'avatar':avatar});
    });
   });
});
  
app.get('/fotos/:id', function(req, res){
  console.log(req.params.id)
if (req.session.user_Id) {
    var id_usuario = req.session.user_Id;
    var username = req.session.user_Name;
    var avatar = req.session.avatar;
  }
  
  if (req.params.id > 0){
    var id_foto=" where id ='"+req.params.id+"'";
    console.log(id_foto)
  }else{
    var id_foto="where imagen ='"+req.params.id+"'";
  }
  var consulta ="SELECT rowid AS id,* FROM fotos "+id_foto;
  db.serialize(function() {
    db.all(consulta, function(err, row) {
      if(row.length > 0){
        var next ="SELECT rowid AS id FROM fotos  where id >"+row[0]['id']+" ORDER BY id LIMIT 1";
        db.all(next, function(err, row_next) {
          var prev ="SELECT rowid AS id FROM fotos  where id <"+row[0]['id']+" ORDER BY id desc LIMIT 1 ";
           db.all(prev, function(err, row_prev) {
            console.log(row+":"+row_next+":"+row_prev)
            res.render('home2', {'name': row,'usuario':username,'id_usuario':id_usuario,'avatar':avatar,'next':row_prev,'prev':row_next});
          });
        });
      }else{
        res.render('home2');
        
      }
    });
   });
});
app.post('/', function(req, res) {
  console.log(req.body.userName);
  if(req.body.userName){
    var user ={
       _Id : req.body.userName[0]
      ,_Name : req.body.userName[1]
      ,_LastName : req.body.userName[2]
      ,_FirstName : req.body.userName[3]      
      ,_Avatar : req.body.userName[4]      
    }
    console.log(Users)
    req.session.user_Id =user._Id;
    req.session.user_Name =user._Name;
    req.session.avatar =user._Avatar;
    var consulta ="SELECT id_usuario,name FROM users where id_usuario='"+user._Id+"'";
    db.serialize(function() {
      db.all(consulta, function(err, row) {
        var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?)");
          if(row.length==0){
        stmt.run(user._Id,user._Name,user._LastName,user._FirstName);
        }
      });
  })
  }else{
    db.serialize(function() {
      var stmt = db.prepare("INSERT INTO fotos VALUES (?,?,?)");
           Users[req.session.user_Name] ={};
           Users[req.session.user_Name]['fotos']={};
      if(req.files.myFile.path!=null){
          var elpath = req.files.myFile.path,
              upFoto = elpath.split("/");
              upFoto = upFoto[upFoto.length-1];
          var type = upFoto.split(".");
              type = type[type.length-1];
              stmt.run(req.session.user_Id,upFoto,type);
              Users[req.session.user_Name]['fotos'][0] = upFoto;
              console.log(upFoto+" unafoto");
      }
      stmt.finalize();
    });
  }
  res.end();
});

io.on('connection', function(socket){
  socket.on('message', function(msg){
  for (var i in Users[msg]['fotos']){
    crop(Users[msg]['fotos'][i])
  }
  });
});

 http.listen(3000, function(){  
  console.log('listening on */:3000');
 });
var crop = function(upFoto){
  easyimg.rescrop({
    src:__dirname + '/public/fotos-boda/'+upFoto, dst:__dirname + '/public/thumbnail/'+upFoto,
    width:500, height:500,
    cropwidth:100, cropheight:100,
    x:0, y:0
  }).then(function(image) {
    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
    io.emit('message', upFoto);
  },
  function (err) {
  console.log(err);
  });

}