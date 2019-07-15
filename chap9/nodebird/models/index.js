const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post); //foreignKey 를 따로 설정안하면 post테이블에 userId 컬럼이 foreignKey로 추가된다
db.Post.belongsTo(db.User);
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //관계정의는 p363을 보자
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
db.User.belongsToMany(db.User, {    //관계정의는 p364을 보자
  foreignKey: 'followingId',
  as: 'Followers',      //view/profile.pug 에서 이 이름으로 데이터를 가져온다.
  through: 'Follow',    //테이블 생성함.
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

module.exports = db;
