const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const short = require('short-uuid');
const sgMail = require('@sendgrid/mail')
// const toastr = require('express-toastr');
// app.use(toastr());

// Route Files
const quizRoutes = require('./routes/quiz-routes')

require("dotenv").config();

const Student = require('./models/Student')

app.set('view engine', 'ejs');

// const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({extended:true}));

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
    
    app.post("/registerStudent", async(req, res) => {
        const data = req.body;
        // function getRandomInt(max) {
        //     return Math.floor(Math.random() * max);
        // }
        
        const student = new Student({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            qualification: data.qualification,
            // applicationNo: `Y22A${getRandomInt(500)}`
            applicationNo: `Y22A${short.generate()}`
        });
        
        try {
            const savedStudent = await student.save()
            res.status(201)
            .redirect(`/proceed/${savedStudent._id}`)
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });

    app.get('/proceed/:id', async (req, res) => {
        const id = req.params.id
        const registeredStudent = await Student.findById(id)
        res.render('step3',{fullName:registeredStudent.fullName, applicationNo: registeredStudent.applicationNo, id: registeredStudent.id});
    });

    // SEND MAIL & RESPONSE
    app.get('/mailresponse/:id', async (req, res) => {
        const id = req.params.id
        const registeredStudent = await Student.findById(id)
        
        
        // Mail Sender
        let link = `localhost:3000/entranceExam/${id}` 
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: `${registeredStudent.email}`,
            from: 'jdayo2017@gmail.com',
            subject: 'LMIT Application',
            // text: `Dear, fullName, Your application Number is: ${registeredStudent.applicationNo}. Click the link to take test "localhost:3000/entranceExam/${id}"`,
            html: ` <h3>Dear ${registeredStudent.fullName},</h3>
            <p>Your application Number is: <strong>${registeredStudent.applicationNo}</strong>. Visit the link to take test ${link}</p>
            <p>Good luck.</p>`,
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.render('sentMail',{ fullName:registeredStudent.fullName, email: registeredStudent.email, applicationNo: registeredStudent.applicationNo, id: registeredStudent.id });
            })
            .catch((error) => {
                console.error(error)
            })
    });
    
    app.get('/entranceExam/:id', async(req, res) => {
        let id = req.params.id;
        
        Student.findById(id, (err, user) => {
            if(err) {
                console.log(err)
            } else {
                if(user === null) {
                    console.log("User not found")
                } else {
                    res.render('entrance', {fullName: user.fullName, applicationNo: user.applicationNo, id: user.id, testTaken: user.takenTest});
                }
            }
        })
    });

    app.use('/quiz',quizRoutes);

    // Set Public Folder
    app.use(express.static(path.join(__dirname, '/public')));


  // Server
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
};

startServer();