
const connection = require("../config/db");

exports.register = (req, res) => {
  console.log(req.body);

  const { name, phoneno, email, password } = req.body;

  
      // Insert new user into database
      const sql = 'INSERT INTO student (name, phoneno, email, password) VALUES (?, ?, ?, ?)';
      connection.query(sql, [name, phoneno, email, password], (err, result) => {
        if (err) {
          console.error('Error executing query:', err.stack);
          return res.status(500).send('Error inserting data into database');
        }
        res.status(200).send('User registered successfully!');
      });
}
