const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Phuocmai123',
    database: 'eshop_app'
})

module.exports = connection;

// const mysql = require('mysql2');
//
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Phuocmai123',
//     database: 'eshop_app',
//     charset: 'utf8_general_ci'
// });
//
// connection.connect(function (err) {
//     if (err) {
//         throw err.stack;
//     }
//     else
//         console.log("connect success");
// })