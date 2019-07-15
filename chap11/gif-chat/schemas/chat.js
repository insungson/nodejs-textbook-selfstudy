const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: {   //(채팅방 아이디)
    type: ObjectId,    //room필드는 Room 스키마와 연결하여(ref:Room) Room컬렉션의 ObjectId가 들어간다.
    required: true,
    ref: 'Room',
  },
  user: {   //(채팅을 한 사람)
    type: String,
    required: true,
  },
  chat: String, //(채팅내역)         //chat, gif 필드에 required(데이터존재유무확인) 속성이 없는 이유는 
  gif: String,  //(GIF이미지 주소 )  //채팅메시지, GIF이미지 둘중 하나만 저장하면되기때문이다.
  createdAt: {  //(채팅시간)
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);


///////////////////////////////
//아래는 https://mongoosejs.com/docs/populate.html 에 나온 예시이다.

// const PersonSchema = new Schema({
//   name: String,
//   band: String
// });

// const BandSchema = new Schema({
//   name: String
// });
// BandSchema.virtual('members', {
//   ref: 'Person', // The model to use
//   localField: 'name', // Find people where `localField`
//   foreignField: 'band', // is equal to `foreignField` 이건 외래키 같은것이다.
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: false,
//   options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
// });

// const Person = mongoose.model('Person', PersonSchema);
// const Band = mongoose.model('Band', BandSchema);
/**
 * Suppose you have 2 bands: "Guns N' Roses" and "Motley Crue"
 * And 4 people: "Axl Rose" and "Slash" with "Guns N' Roses", and
 * "Vince Neil" and "Nikki Sixx" with "Motley Crue"
 */

// Band.find({}).populate('members').exec(function(error, bands) {
//   /* `bands.members` is now an array of instances of `Person` */
// });

//위의 예를 정리하면 
//person 스키마는 사람이름(name), 밴드이름(band)
//Band 스키마는 밴드이름(name), members 라는 이름으로 밴드의 맴버를 [] 배열로 묶는다.
//             foreignField 는 외래키 같은 것이다. localField 는 ref로 연결한 스키마 본연의 컬럼이다.
//예를 보자
//person 스키마에 안유진,아이즈원   나코,아이즈원    김민주,아이즈원 을 넣고
//band 스키마에 아이즈원을 넣고 members 로 설정을 하면
//band 를 찾으면 아이즈원[안유진,나코,김민주]    이런식으로 배열로 나열된다.
//이부분은 routes/index.js   59번째 줄 에 나온 예와 같다