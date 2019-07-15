const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,  //unique 설정을 하면 몽고디비 각 document마다 고유의 _id가 있지만 name으로 조회가능하다.
    },
    age:{
        type: Number,
        required: true,
    },
    married:{
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User',userSchema); //model() 를 통해 몽구스와 여기서 정의한 스키마를 연결한다.)