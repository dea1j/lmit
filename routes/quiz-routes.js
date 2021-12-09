const express = require('express');
const routerQuiz = express.Router();
const questionController = require('../controllers/questionController')

// Quiz API Route (/quiz)
routerQuiz.get('/:id', questionController.getQuestions);

// Quiz API Route (/quiz/next)
routerQuiz.post('/next/:id', questionController.nextQuestion);

// Quiz API Route (/quiz/back)
routerQuiz.get('/back/:id', questionController.backButton);

module.exports = routerQuiz;
