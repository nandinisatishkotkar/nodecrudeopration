
const connection = require("../config/db");

exports.login = (req, res) => {
    console.log(req.body);
  
    const { name, password } = req.body;
  
    
        // Insert new user into database
        const sql =connection.query("SELECT *FROM admin WHERE name = ? AND password= ?", [name,password],(err, results) => {
  
          if(results.length>0){
            res.redirect('/list');
          }else
        
          res.redirect('/login');
              // Render the data in the EJS template
            });  
  }