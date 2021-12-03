const questionsModel = require('../models/questions');
const databaseQuestions = require('../sample_databse _files/questions.json')

const Student = require('../models/Student')

// initialize variables 
var questions = [],
    answers = [],
    i = 0;

module.exports = {

 // Get All Questions
    getQuestions(req,res,next){
		if(databaseQuestions.length) {
			questions = databaseQuestions;
			answers = [];
			res.render('quiz',{question:questions[0].question, options:questions[0].options, total:questions.length, questionIndex: i +1, id:req.params.id });
		} else {
			console.log("Error")
		}
	},

 /* 
   * Render Next Question of the quiz 
   * match the  answers user selected and the correct answers
 */
	nextQuestion(req,res,next){
	i = i + 1;
	let ID = req.params.id
	Student.findById(ID, function(err, user) {
    	if(user.takenTest) {
			res.render('entrance', {fullName: user.fullName, applicationNo: user.applicationNo, id: user.id, testTaken: user.takenTest});
		}

		if(req.body.optradio){
			if(i <= questions.length) {
				answers.push(req.body.optradio);
			}
			if(i < questions.length){
				res.render('quiz',{question:questions[i].question, options:questions[i].options, total:questions.length, questionIndex: i +1, id:ID});

			} else {
				i=0;
				var score = 0;
				for(let j = 0 ; j < questions.length; j++) {
					if(questions[j].answer == answers[j])
					{
					score = score + 1;
					}
				}
				

				Student.findById(ID, async (err, user) => {
					if(err) {
						console.log(err)
					} else {
						if(user === null) {
							console.log("User not found")
						} else {
							await user.update({
								takenTest: true,
								score: score
							})
						}
					}
				})
				
				res.render('result',{score:score,total:questions.length})

			}
		}
	  })
	},

	
	backButton(req,res,next){
		i = i - 1;
		let ID = req.params.id
		if(req.body.optradio){
			if(i <= questions.length) {
				answers.push(req.body.optradio);
			}
			if(i < questions.length){
				res.render('quiz',{question:questions[i].question, options:questions[i].options, total:questions.length, questionIndex: i +1, id:ID});

			} else {
				i=0;
				var score = 0;
				for(let j = 0 ; j < questions.length; j++) {
						if(questions[j].answer == answers[j])
						{
						score = score + 1;
						}
				}
			}
		} 
	}
}
