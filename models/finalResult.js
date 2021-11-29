const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    score: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', StudentSchema)
