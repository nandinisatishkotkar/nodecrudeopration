const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');
const path = require('path');
const registercontroller=require('./controller/register');
const logincontroller=require('./controller/login');
const usercontroller=require('./controller/user');


dotenv.config();
const app = express();

// Define the public directory for static files (e.g., CSS, images)
const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set the views directory for EJS templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define the home route
app.get("/", (req, res) => {
    res.render("index");
});

/*app.get("/list", (req, res) => {
    res.render("list");
});*/

app.get("/list", usercontroller.list);
// Register route (corrected spelling)
app.get("/register", (req, res) => {
    res.render("register"); // Corrected the spelling here
});
// Register post route (corrected spelling)
app.post("/register", registercontroller.register);

app.get("/login", (req, res) => {
    res.render("login"); // Corrected the spelling here
});

app.get("/edit/:id", usercontroller.edit);  // Show the edit form
app.post("/edit/:id", usercontroller.update);  // Handle the form submission

app.get("/delete/:id", usercontroller.delete);  // Handle delete request


app.post("/login",logincontroller.login);
app.get("/students",usercontroller.students);

// Start the server
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
