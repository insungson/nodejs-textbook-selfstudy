const mongoose = require('mongoose');

module.exports = ()=>{
    const connect = ()=>{
        if(process.env.NODE_ENV !== 'production'){ //개발환경이 아닐때 몽구스가 생성하는 쿼리내용을
            mongoose.set('debug', true);          //콘솔을 통해 확인 가능하다.
        }
        mongoose.connect('mongodb://son:비번@localhost:27017/admin', { //몽구스-몽고디비 연결부분
            dbname: 'nodejs',    //몽고디비 주소로 접속을 시도한다.(접속을 시도하는 주소는 admin이지만) 
        },(error)=>{            //두번째 인자로 dbname: 'nodejs'  nodejs 데이터베이스를 사용한다.
            if(error){          //아래의 콜백함수로 연결여부를 확인을 한다.
                console.log('몽고디비 연결 에러', error);
            }else{
                console.log('몽고디비 연결 성공');
            }
        });
    };
    connect();

    //에러발생 시 에러 내용을 기록하고, 연결 종료시 재연결을 시도한다.
    mongoose.connection.on('error', (error) =>{ 
        console.error('몽고디비 연결 에러',error);
    });
    mongoose.connection.on('disconnected', ()=>{
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        connect();
    });

    //User, Comment 스키마를 연결하는 부분이다.
    require('./user');
    require('./comment');
};