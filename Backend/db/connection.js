const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "store_rating"
});

connection.connect((err)=>{
    if(err){
        console.error("Database connectin failed:",err);
        return;
    }
    console.log("Connected to MySQL");
});

module.exports = connection;