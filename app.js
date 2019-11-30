require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    app = express(),
    port = 5000,
    homeRoute = require('./routes/homeRoute'),
    userRoute = require('./routes/userRoute'),
    questionRoute = require('./routes/questionRoute'),
    answerRoute = require('./routes/answerRoute'),
    schedule = require('./helpers/cronJob');

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, { useNewUrlParser: true });

schedule()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// R O U T I N G
app.use('/', homeRoute);
app.use('/users', userRoute);
app.use('/questions', questionRoute);
app.use('/answers', answerRoute);

app.listen(port, () => console.log(`Listen on port ${port} `))