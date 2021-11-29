const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const short = require('short-uuid');
const bodyParser = require('body-parser')
require("dotenv").config();

const testRoutes = require('./routes/testRoute');
const dbConfig = require('./db/db');
const Student = require('./models/Student')

app.set('view engine', 'ejs');
app.use(express.json());

const urlencodedParser = bodyParser.urlencoded({ extended: false });


// Api Routes
app.get('/', function(req, res){ 
    res.render('index');
});

app.get('/mailresponse', function(req, res){ 
    res.render('sentMail');
});

app.get('/entranceExam', urlencodedParser, async(req, res) => {
    res.render('entrance');
});

app.get('/proceed', function(req, res){
    const fullName = req.query.fullName
    const applicationNo = req.query.applicationNo

    res.render('step3',{fullName:fullName, applicationNo: applicationNo});
});


app.post("/registerStudent", urlencodedParser, async(req, res) => {
    const data = req.body;

    const student = new Student({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        qualification: data.qualification,
        applicationNo: short.generate()
    });

    try {
        const savedStudent = await student.save()
        res.status(201)
        .redirect(`/proceed?fullName=${savedStudent.fullName}&applicationNo=${savedStudent.applicationNo}`)
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});




app.use('/test', testRoutes)

// Set Public Folder
app.use("/css",  express.static(path.join(__dirname, 'public', 'css')));
app.use("/js",  express.static(path.join(__dirname, 'public', 'js')));
app.use("/img",  express.static(path.join(__dirname, 'public', 'img')));

const PORT = process.env.PORT || 3000;

// Database Connection Mongoose
mongoose.connect(dbConfig.database)
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to database');
});

mongoose.connection.on('error', (err) => {
    console.log('Database error ' + err)
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})