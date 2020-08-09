// Set up MySQL connection.
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    // port local is 3306
    port: 3306,

    user: process.env.DB_USER,

    password: process.env.DB_PASS,
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
