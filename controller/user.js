const connection = require("../config/db");

/*exports.list = (req, res) => {
  const itemsPerPage = 10;  // Number of records per page
    const page = req.query.page || 1;  // Current page number (default to 1 if not specified)
    const offset = (page - 1) * itemsPerPage;  // Calculate the offset for pagination

    // Query to get students with pagination
    const sql = 'SELECT * FROM student ORDER BY id ASC LIMIT ? OFFSET ?';
    connection.query(sql, [itemsPerPage, offset], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).send('Database error');
        }

        // Query to get the total count of students for pagination
        const countSql = 'SELECT COUNT(*) AS total FROM student';
        connection.query(countSql, (err, countResult) => {
            if (err) {
                console.error('Error executing count query:', err.stack);
                return res.status(500).send('Database error');
            }

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / itemsPerPage);  // Calculate the total number of pages

            // Render the student list and pass pagination data
            res.render("list", {students: result,currentPage: parseInt(page),totalPages: totalPages});
        });
    });
};*/

exports.list=(req,res)=>{
          const sql = 'Select * from student order by id asc';
        
          connection.query(sql, (err, result) => {
            if (err) {
              console.error('Error executing query:', err.stack);
            }
             res.render("list",{'students':result});
          });
 }
 exports.students = (req, res) => {
  const { start, length, search, order, draw } = req.query;
  
  // Ensure search is not undefined, and default to empty string if missing
  const searchValue = search && search.value ? search.value : '';

  // SQL query to get the total count of students (for pagination)
  const countSql = 'SELECT COUNT(*) AS total FROM student';

  // Start building the SQL query to fetch students
  let sql = 'SELECT * FROM student';

  // Apply search filter if search value is provided
  if (searchValue) {
    sql += ` WHERE name LIKE '%${searchValue}%' OR email LIKE '%${searchValue}%'`;
  }

  // Sorting parameters: determine the column index and direction
  const orderColumnIndex = order && order[0].column ? order[0].column : 0;  // Default to first column if no ordering
  const orderDirection = order && order[0].dir ? order[0].dir : 'asc';  // Default to 'asc' if no direction specified
  const orderColumns = ['id', 'name', 'phoneno', 'email'];  // Columns available for sorting
  const orderColumn = orderColumns[orderColumnIndex];  // Get the corresponding column name

  sql += ` ORDER BY ${orderColumn} ${orderDirection}`;

  // Ensure 'start' and 'length' are valid integers
  const limitStart = parseInt(start) || 0;  // Default to 0 if start is NaN
  const limitLength = parseInt(length) || 10;  // Default to 10 if length is NaN

  // Pagination
  sql += ` LIMIT ${limitStart}, ${limitLength}`;
  //console.log(sql);
  // Log the query for debugging purposes
  console.log('Executing SQL query:', sql);

  // Query to get the total number of students
  connection.query(countSql, (err, countResult) => {
    if (err) {
      console.error('Error executing count query:', err.stack);
      return res.status(500).send('Error executing count query');
    }

    // Query to get the paginated list of students
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err.stack);
        return res.status(500).send('Error executing query');
      }

      // Respond with the data in the format DataTables expects
      res.json({
        draw: parseInt(draw),  // To match the draw counter from DataTables
        recordsTotal: countResult[0].total,  // Total number of records in the database
        recordsFiltered: result.length,  // Filtered records after applying search
        data: result  // The actual data for the table
      });
    });
  });
};
    
  // In usercontroller.js
exports.edit = (req, res) => {
  const studentId = req.params.id;  // Get the student ID from the URL parameter
  const sql = 'SELECT * FROM student WHERE id = ?';  // SQL query to fetch the student data

  connection.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send("Error fetching student data.");
    }

    if (result.length === 0) {
      return res.status(404).send("Student not found.");
    }

    const student = result[0];  // The student data fetched from the database
    res.render("edit", { student });  // Pass the student data to the edit template
  });
};
// In usercontroller.js
exports.update = (req, res) => {
  const studentId = req.params.id;  // Get the student ID from the URL parameter
  const { name, phoneno, email } = req.body;  // Get updated data from the form

  const sql = 'UPDATE student SET name = ?, phoneno = ?, email = ? WHERE id = ?';  // SQL query to update the student
  connection.query(sql, [name, phoneno, email, studentId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send("Error updating student.");
    }

    // Redirect to the list page after updating
    res.redirect("/list");  // After update, go back to the student list page
  });
};


exports.delete = (req, res) => {
  const studentId = req.params.id;  // Get the student ID from the URL parameter
  const sql = 'DELETE FROM student WHERE id = ?';  // SQL query to delete the student

  connection.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send("Error deleting student.");
    }

    // Redirect to the list page after deletion
    res.redirect("/list");  // After deletion, go back to the student list page
  });
};

