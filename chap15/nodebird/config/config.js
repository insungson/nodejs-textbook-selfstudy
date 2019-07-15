require('dotenv').config();

module.exports = {
  development: {
    username: 'root', //root 계정을 숨기고 싶다면 이정보 역시 process.env로 바꾸면 된다
    password: process.env.SEQUELIZE_PASSWORD,   //password를 숨기기 위해 process.env 처리함
    database: 'nodebird',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: 'false',
  },
  production: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: 'false',
    logging: false,     //배포용인 production일 경우 logging에 false를 주면 쿼리명령어를 숨길 수 있다.
  },
};
