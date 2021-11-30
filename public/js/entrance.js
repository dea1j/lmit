let quiz = {
  questions: [
    {
      text: "What is the full form of HTTP?",
      responses: [
          { text: "Hyper text transfer package" },
          { text: "Hyper text transfer protocol", correct: true },
          { text: "Hyphenation text test program" },
          { text: "None of the above" }
      ]
    },
    {
      text: "HTML document start and end with which tag pairs?",
      responses: [
          { text: "HTML", correct: true },
          { text: "WEB" },
          { text: "HEAD" },
          { text: "BODY" }
      ]
    },
    {
      text: "Which tag is used to create body text in HTML?",
      responses: [
          { text: "HEAD" },
          { text: "BODY", correct: true },
          { text: "TITLE" },
          { text: "TEXT" }
      ]
    },
    {
      text: "Outlook Express is _________",
      responses: [
          { text: "E-Mail Client", correct: true },
          { text: "Browser" },
          {
            text: "Search Engine"
          },
          { text: "None of the above" }
      ]
    },
    {
      text: "What is a search engine?",
      responses: [
          { text: "A hardware component " },
          {
            text: "A machinery engine that search data"
          },
          { text: "A web site that searches anything", correct: true },
          { text: "A program that searches engines" }
      ]
    },
    {
      text:
          "What does the .com domain represents?",
      responses: [
          { text: "Network" },
          { text: "Education" },
          { text: "Commercial", correct: true },
          { text: "None of the above" }
      ]
    },
    {
      text: "In Satellite based communication, VSAT stands for? ",
      responses: [
          { text: " Very Small Aperture Terminal", correct: true },
          { text: "Varying Size Aperture Terminal " },
          {
            text: "Very Small Analog Terminal"
          },
          { text: "None of the above" }
      ]
    },
    {
      text: "What is the full form of TCP/IP? ",
      responses: [
          { text: "Telephone call protocol / international protocol" },
          { text: "Transmission control protocol / internet protocol", correct: true },
          { text: "Transport control protocol / internet protocol " },
          { text: "None of the above" }
      ]
    },
    {
      text:
          "What is the full form of HTML?",
      responses: [
          {
            text: "Hyper text marking language"
          },
          { text: "Hyphenation text markup language " },
          { text: "Hyper text markup language", correct: true },
          { text: "Hyphenation test marking language" }
      ]
    },
    {
      text: "\"Yahoo\", \"Infoseek\" and \"Lycos\" are _________?",
      responses: [
          { text: "Browsers " },
          { text: "Search Engines", correct: true },
          { text: "News Group" },
          { text: "None of the above" }
      ]
    },
  ]
}

const handleContinue = () => {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let fullname = url.searchParams.get("fullName");
  let applicationNo = url.searchParams.get("applicationNo");
  let email = url.searchParams.get("email");
  window.location = `/entranceExam?fullname=${fullname}&email=${email}&applicationNo=${applicationNo}`
}


var app = new Vue({
  data: {
    step: 1,
    quiz: quiz,
    questionIndex: 0,
    userResponses: Array(quiz.questions.length).fill(false),
    isActive: false
  },
  methods: {
    startTest() {
      this.step += 1;
    },
    selectOption: function(index) {
      Vue.set(this.userResponses, this.questionIndex, index);
      console.log(this.userResponses);
    },
    next: function() {
      if (this.questionIndex < this.quiz.questions.length)
      this.questionIndex++;
    },
    prev: function() {
      if (this.quiz.questions.length > 0) this.questionIndex--;
    },
    score: function() {
      let score = 0;
      for (let i = 0; i < this.userResponses.length; i++) {
        if (
            typeof this.quiz.questions[i].responses[
              this.userResponses[i]
            ] !== "undefined" &&
            this.quiz.questions[i].responses[this.userResponses[i]].correct
        ) {
            score = score + 1;
        }
      }
      console.log(score)
      return score;
    }
  }
}).$mount("#app");


// const sgMail = require('@sendgrid/mail')
// // const link = `localhost:8000/testLink/`;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'test@example.com',
//   from: 'jdayo2017@gmail.com',
//   subject: 'LMIT Application',
//   text: `Dear, fullName, Your application Number is: applicationNo. CLick the link to take test link`,
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
