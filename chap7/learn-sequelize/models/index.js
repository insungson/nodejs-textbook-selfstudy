const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname + '/../config/config.json'))[env]; //이부분 그대로 둬도 될지 확인
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//시퀄라이즈와 유저, 댓글 따로따로 연결함.
db.User = require('./user')(sequelize, Sequelize);  
db.Comment = require('./comment')(sequelize, Sequelize);
//사용자-댓글 관계 설정
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});

module.exports = db;
