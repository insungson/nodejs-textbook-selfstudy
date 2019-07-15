const mongoose = require('mongoose');

const { Schema } = mongoose;
const favoriteSchema = new Schema({
  placeId: {      //장소아이디
    type: String,
    unique: true,   //고유의 값을 가진다.
    required: true, //필수적으로 입력해야 한다.
  },
  name: {         //장소명
    type: String,
    required: true,
  },
  location: { type: [Number], index: '2dsphere' }, //좌표명
  //2dsphere는 위도,경도를 넣는 위치정보를 배열로 받는다는 의미
  createdAt: {      //생성시간
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);