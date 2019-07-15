const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types: {ObjectId}} = Schema;
const commentSchema = new Schema({
    commenter: {        //자료형(type)이 ObjectId 이다.  옵션으로 ref 속성이 User 이다.
        type: ObjectId, //*이것은 commenter 필드에 User 스키마의 사용자 ObjectId가 들어간다는 의미이다!!
        required: true, // required : 먼저 데이터가 들어갈 때 값의 존재 유무를 검증하고 싶다면 이 옵션을 쓴다.
        ref: 'User',//commenter 항목의 존재 유무를 검색하고 commenter항목에 데이터가 없다면 저장하지 않을 것이다!
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema); 
//몽구스는 model()의 첫번째 인자로 컬렉션 이름을 만든다. 첫번째 인자의 첫글자를 소문자로 만들고, 복수형으로 바꿔서
//컬랙션을 생성한다. 여기서 예를 들면 Comment는 Comment -> comment -> comments  로 된다. 이게 싫다면 
//세번째 인자를 줘서 설정하면 된다 예를 들면 mongoose.model('Comment',commentSchema,'comment_table')
//로 설정하면 comment_table로 컬랙션이 생성된다.