const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {  //(방제목)
    type: String,
    required: true,     // required : 먼저 데이터가 들어갈 때 값의 존재 유무를 검증하고 싶다면 이 옵션을 쓴다.
  },                    //title 항목의 존재 유무를 검색하고 title항목에 데이터가 없다면 저장하지 않을 것이다!
  max: {    //(최재수용인원)
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  owner: {  //(방장)
    type: String,
    required: true,
  },
  password: String, //(비밀번호)    설정하면 비밀방, 설정안하면 공개방
  createdAt: {  //(생성시간)
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);