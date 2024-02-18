const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const dbConnect = require('./config/dbCommect');



app.use('/', (req, res) => {
    res.send("ijyiu")
})


dbConnect()
    .then(() => {
        // Database connection successful
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });
