// Set up MySQL connection.
var mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    // port local is 3306
    port: 3306,

    user: 'root',

    password: 'iC4]mY5*pZ4<uD7&rP8(',
    database: 'employees'
});


// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    //console.log("connected as id " + connection.threadId);
    // startEmpCMS();
});

// Export connection for our ORM to use.
module.exports = connection;
