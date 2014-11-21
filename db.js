var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/database.db');

db.serialize(function() {
  db.run("CREATE TABLE fotos (id_usuario TEXT,imagen TEXT,type TEXT)");
  db.run("CREATE TABLE users (id_usuario TEXT,nombre TEXT)");

});

db.close();