var mysql = require("mysql");
var config = require("./config");

var pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.db,
    dateStrings: 'date',
    connectionLimit:1000,
    waitForConnections:false
});

exports.pool = pool;
