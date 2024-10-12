// Declare or initialise dependence
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv =require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// connect to the database -Important
    const db = mysql.createConnection(
        {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    });

// check if db connection works
db.connect((err) => {
    //No wedding
    if (err) return console.log('Error connecting to mysql database');
    // Yes wedding connected
    console.log('connected to mysql successfully', db.threadId);
});

// Your code goes here
    // Get METHOD example
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    // data is the name of the file inside views folder

    app.get('/data', (re, res) => {
        // Retrieve data from database
        db.query('SELECT * FROM patients', (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else { // render the data in template
                res.render('data', {results: results});
                };
        });
    });


// Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            res.render('data', { results: results });
        }
    });
});


app.get('/patients/search', (req, res) => {
    const firstName = req.query.firstName; // Capture first name from query string
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients');
        } else {
            res.render('data', { results: results });
        }
    });
});


app.get('/providers/specialty', (req, res) => {
    const specialty = req.query.specialty;
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers');
        } else {
            res.render('data', { results: results });
        }
    });
});





// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Send message to the browser
    console.log('Sending message to the browser...');
    app.get('/', (req, res) => {res.send('Server is connected')
    });
});