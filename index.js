const bodyParser = require('body-parser')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const app = express();
const PORT = process.env.PORT || 3000;
const dbConnect = require('./config/dbCommect');
const authRout = require('./routes/authRout')
const cokieParser = require('cookie-parser')// to refresh token
// const authRout = require('./routes/authRout')
// const authRout = require('./routes/authRout')
// const authRout = require('./routes/authRout')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cokieParser())




app.use('/api/user', authRout)

app.use(notFound)
app.use(errorHandler)


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
