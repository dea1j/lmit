const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    regId: {
      type: Number,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    qualification: {
      type: String,
    },
    applicationNo: {
      type: String,
    },
    takenTest: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', StudentSchema)
