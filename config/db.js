const mysql=require('mysql');
const dotenv=require('dotenv');

dotenv.config();


var connection=mysql.createConnection({
    host:process.env.HOST ,
    user:process.env.USER ,
    password:process.env.PASSWORD ,
    database:process.env.DATABASE,
})
connection.connect((err)=>{
    if(err) throw err
        console.log('DB is connected');
});
module.exports=connection;  