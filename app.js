const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require("dotenv").config();

// const testRoutes = require('./routes/testRoute');
const Student = require('./models/Student')

app.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({ extended: false });


const startServer = async () => {
  await mongoose
    .connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

    // NON-ROUTE MIDDLEWARE
    app.use(express.json());

    // Routes
    app.get('/', function(req, res){ 
        res.render('index');
    });

    app.get('/mailresponse', function(req, res){ 
        res.render('sentMail');
    });
    
    app.get('/proceed', function(req, res){
        const fullName = req.query.fullName
        const applicationNo = req.query.applicationNo
        res.render('step3',{fullName:fullName, applicationNo: applicationNo});
    });
    
    
    app.post("/registerStudent", urlencodedParser, async(req, res) => {
        const data = req.body;
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        
        const student = new Student({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            qualification: data.qualification,
            applicationNo: `Y22A${getRandomInt(500)}`
        });
        
        try {
            const savedStudent = await student.save()
            res.status(201)
            .redirect(`/proceed?fullName=${savedStudent.fullName}&email=${savedStudent.email}&applicationNo=${savedStudent.applicationNo}`)
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });
    
    app.get('/entranceExam', async(req, res) => {
        res.render('entrance');
    });

    // app.use('/test', testRoutes)

    // Set Public Folder
    app.use("/css",  express.static(path.join(__dirname, 'public', 'css')));
    app.use("/js",  express.static(path.join(__dirname, 'public', 'js')));
    app.use("/img",  express.static(path.join(__dirname, 'public', 'img')));


  // Server
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
};

startServer();