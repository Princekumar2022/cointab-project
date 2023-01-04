const mysql = require('mysql')

//create connection with mySQL

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'project_data_1'
    
})
connection.connect((err) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log("Connected Successfully...!!")
    }
})

module.exports ={connection}



// let userTable = `create table userTable(id int NOT NULL AUTO_INCREMENT PRIMARY KEY , name varchar(100),email varchar(100),
// password varchar(100) , failed_attempt int default 0 , last_failed_attempt timestamp);`
// con.query(userTable, function (err, result) {
//       if (err) console.log("User Table Already Present")
//       else console.log("User Table created");
// })