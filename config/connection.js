// Set up MySQL connection.
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const connection = mysql.createConnection({
    //process env encapsulation of password user and host name
    host: process.env.DB_HOST,
    // port local is 3306
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employees'
});


// Make connection or err out
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

});

// Export connection for server file
module.exports = connection;
