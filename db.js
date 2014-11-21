var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/database.db');

db.serialize(function() {
  db.run("CREATE TABLE fotos (id_usuario INT,imagen TEXT,type TEXT)");
  db.run("CREATE TABLE users (id_usuario INT UNIQUE PRIMARY KEY,name TEXT,last_name TEXT,first_name TEXT)");

});

db.close();

/*
response.email: "fco_chavezg@hotmail.com"
response.first_name: "Don-Paco"
gender: "male"
id: "10152520855140875"
last_name: "Chavez"
link: "https://www.facebook.com/app_scoped_user_id/10152520855140875/"
locale: "es_LA"
name:"Don-Paco Chavez"timezone: -7
updated_time: "2014-11-02T03:49:01+0000"
*/


