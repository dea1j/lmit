// Dependencies
const express = require('express');
const routerQuiz = express.Router();

//controller
const questionController = require('../controllers/questionController')


// Quiz API Routes (/quiz)
routerQuiz.get('/:id', questionController.getQuestions);

// Quiz API Routes (/quiz/next)
routerQuiz.post('/next/:id', questionController.nextQuestion);

// Quiz API Routes (/quiz/back)
routerQuiz.post('/back/:id', questionController.backButton);

// Export this Module
module.exports = routerQuiz;
