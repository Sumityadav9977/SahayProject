const mysql = require('mysql');
var connection = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    database: "adminpannel",
    port: 3306
});

connection.connect(function(err){
    if(err){
             console.log(err.sqlMessage);
    }
    else{
        console.log("{Database connection}")
    }
});

  
  
  
  
  
module.exports = connection;