const mongoose = require('mongoose');

const { Schema } = mongoose;
const historySchema = new Schema({
  query: {  //검색어
    type: String,
    required: true,
  },
  createdAt: { //생성시간
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);