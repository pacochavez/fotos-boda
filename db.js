var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/database.db');

db.serialize(function() {
  db.run("CREATE TABLE fotos (album TEXT,imagen TEXT,type TEXT)");
  db.run("CREATE TABLE users (iduser TEXT,nombre TEXT)");

});

db.close();