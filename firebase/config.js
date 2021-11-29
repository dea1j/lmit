const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyDx-0fGLuCvxT_5vrYYNxgFc4OCRgdd3VI",
    authDomain: "lmit-2399e.firebaseapp.com",
    projectId: "lmit-2399e",
    storageBucket: "lmit-2399e.appspot.com",
    messagingSenderId: "738023170133",
    appId: "1:738023170133:web:7c26a72888b1470e7774dc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Students = db.collection("Students");
module.exports = Students;