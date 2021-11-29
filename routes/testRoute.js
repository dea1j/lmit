const express = require('express');
const testRouter = express.Router();

const testController = require('../controllers/testController');


// Quiz API Routes (/test)
// testRouter.get('/', testController.getQuestions);

// Quiz API Routes (/test/next)
// testRouter.post('/next', testController.nextQuestion);

// Quiz API Routes (/test/prev)
// testRouter.post('/next', testController.prevQuestion);

// Export this Module
module.exports = testRouter;
