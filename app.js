const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 4 });
const sgMail = require('@sendgrid/mail')
const { flash } = require('express-flash-message');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Route Files
const quizRoutes = require('./routes/quiz-routes')

require("dotenv").config();

const Student = require('./models/Student')

// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// NON-ROUTE MIDDLEWARE
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');


const startServer = async () => {
  await mongoose
    .connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

    // Routes
    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/mailresponse', function(req, res){ 
        res.render('sentMail');
    });

    app.get('/register', function(req, res) {
        res.render('register')
    })
    
    // REGISTER STUDENT
    app.post("/registerStudent", async(req, res) => {
        const data = req.body;
        console.log(data)
        const existingStudent = await Student.findOne({email: data.email})
        
        if(existingStudent) {
            console.log("Student account already exist")
            // res.json("Student account already exist")
        } else {
            const student = new Student({
                fullName: data.fullName,
                gender: data.gender,
                email: data.email,
                phone: data.phone,
                qualification: data.qualification,
                applicationNo: `Y22A${uid().toUpperCase()}`
            });
            
            try {
                const savedStudent = await student.save()

                // SEND MAIL & RESPONSE   
                    let link = `${process.env.EMAIL_BASE_URL}/entranceExam/${savedStudent.id}` 
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                    const msg = {
                        to: `${savedStudent.email}`,
                        from: 'jdayo2017@gmail.com',
                        subject: 'LMIT Application',
                        "dynamic_template_data": {
                          "fullName": `${savedStudent.fullName}`,
                          "applicationNo": `${savedStudent.applicationNo}`,
                          "link": `${link}`,
                        "subject": 'LMIT Registration',
                        },
                        "template_id":"d-8d4e865441ee4c92ad74f4fd8ad82cdc",
                    };
                    sgMail
                        .send(msg)
                        .then(() => {
                            // app.use(flash({ sessionKeyName: 'Email Sent' }));
                            console.log('Email sent')
                            res.redirect(`/proceed/${savedStudent._id}`)
                        })
                        .catch((error) => {
                            console.error(error)
                        })

            } catch (error) {
                console.log(error)
                res.status(500).send(error);
            }
        }
    });

    app.get('/proceed/:id', async (req, res) => {
        const id = req.params.id
        const registeredStudent = await Student.findById(id)
        res.render('step3',{fullName:registeredStudent.fullName, applicationNo: registeredStudent.applicationNo, id: registeredStudent.id});
    });

    // SEND MAIL & RESPONSE
    app.get('/mailresponse/:id', async (req, res) => {
        res.render('sentMail')
        // const id = req.params.id
        // const registeredStudent = await Student.findById(id)
        
        
        // Mail Sender
//         let link = `${process.env.EMAIL_BASE_URL}/entranceExam/${id}` 
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//         const msg = {
//                     to: `${registeredStudent.email}`,
//                     from: 'jdayo2017@gmail.com',
//                     subject: 'LMIT Application test',
//                     "dynamic_template_data": {
//                       "fullName": `${registeredStudent.fullName}`,
//                       "applicationNo": `${registeredStudent.applicationNo}`,
//                       "link": `${link}`
//                     },
//                     "template_id":"d-8d4e865441ee4c92ad74f4fd8ad82cdc",
//                 };
//         sgMail
//             .send(msg)
//             .then(() => {
//                 console.log('Email sent')
//                 res.render('sentMail',{ fullName:registeredStudent.fullName, email: registeredStudent.email, applicationNo: registeredStudent.applicationNo, id: registeredStudent.id });
//             })
//             .catch((error) => {
//                 console.error(error)
//             })
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