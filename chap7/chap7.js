//mysql을 설치하고 cmd 창에서 
//설치된 폴더로 들어가서 C:\Program Files\MySQL\MySQL Server 5.1  난 이거임...
// mysql -h localhost -u root -p  를 입력하면 cmd에서 mysql을 실행할 수 있다.
//  -h : 접속할 주소
//  -u : 사용자명
//  -p : 비밀번호를 사용하겠다 


//데이터베이스 생성하기
//위의 방법으로 mysql에 접속한 후 
//CREATE SCHEMA [데이터베이스명]    을 입력하여 데이터베이스를 만들자
//CREATE SCHEMA nodejs        로 nodejs 데이터베이스 만들자
//SCHEMA는 데이터베이스와 같은 개념이다. 
//이후  use nodejs    을 입력하여 만든 데이터베이스를 사용하겠다고 선언하자

//이제 테이블을 만들어보자
// CREATE TABLE nodejs.users (
// id INT NOT NULL AUTO_INCREMENT,
// name VARCHAR(20) NOT NULL,
// age INT UNSIGNED NOT NULL,
// married TINYINT NOT NULL,
// comment TEXT NULL,
// created_at DATETIME NOT NULL DEFAULT now(),
// PRIMARY KEY(id),
// UNIQUE INDEX name_UNIQUE (name ASC))
// COMMENT = '사용자 정보'
// DEFAULT CHARSET=utf8
// ENGINE=InnoDB;

//하나하나 살펴보자
//CREATE TABLE [데이터베이스명.테이블명]  으로 테이블을 생성한다.
// (nodejs 데이터베이스 내에 users 테이블을 생성하는 것이다.)
//
//위의 생성한 컬럼의 의미를 보자 id(고유 식별자), name(이름), age(나이), married(결혼여부),
// comment(자기소개), created_at(로우생성일)

//VARCHAR(자릿수) : 0~자릿수 길이의 문자열 
//CHAR(자릿수) : 자릿수 길이의 문자열
//TEXT : 긴 글을 저장할 때 사용
//TINYINT : -127 ~ 128까지의 정수를 저장할 때 사용
//DATETIME : 날짜와 시간에 대한 정보를 담는다.
//AUTO_INCREDEMENT : 자동으로 숫자를 늘린다.
//ZEROFILL : 숫자의 자리수 고정되어 있을 때 사용
//UNSIGNED : 숫자 자료형에 적용되는 옵션 INT와는 달리 0 ~ 4294967295 까지 사용 가능
//DEFAULT CHARSET=utf8  : 테이블 자체 설정으로 이걸 설정하지 않으면 한글이 입력되지 않는다.

//사용자 댓글을 저장하는 테이블을 만들어보자
//id,commenter(댓글을 쓴 사용자 아이디),comment(댓글 내용), creared_at(로우 생성일)

// CREATE TABLE nodejs.comments(
// id INT NOT NULL AUTO_INCREMENT,
// commenter INT NOT NULL,
// comment VARCHAR(100) NOT NULL,
// created_at DATETIME NOT NULL DEFAULT now(),
// PRIMARY KEY(id),
// INDEX commenter_idx (commenter ASC),
// CONSTRAINT commenter FOREIGN KEY (commenter) REFERENCES nodejs.users (id)
// ON DELETE CASCADE
// ON UPDATE CASCADE)
// COMMENT = '댓글'
// DEFAULT CHARSET=utf8
// ENGINE=InnoDB;

//commenter 컬럼에는 댓글을 작성한 사용자의 id를 저장할 것이다. (두개의 테이블을 잇는다.)
//다른 테이블의 기본키를 저장하는 컬럼을 forien key라고 부른다. 
//CONSTRAINT [제약조건명] FOREIGN KEY [컬럼명] REFERENCES [참고하는 컬럼명] 
//위와 같이 forien key를 지정할 수 있다. (여기선 commenter컬럼 - users 테이블의 id컬럼을 연결했다.)
//ON UPDATE, ON DELETE 모두 CASCADE로 설정하여 정보가 수정되거나 삭제될때 연결된 정보 역시 같이 수정,삭제가
//된다는 뜻이다.

//SHOW SCHEMAS;     데이터베이스를 확인할 수 있다.
//SHOW TABLES;      로 테이블을 확인할 수 있다.
//DESC [테이블이름];   로 테이블의 세부속성을 확인할 수 있다.
//DROP TABLE [테이블이름];    테이블을 삭제할 수 있다.


//////////////////////////////////
//CRUD 작업하기
//CREATE : 데이터를 생성해서 데이터베이스에 넣는 작업이다. 
//READ : 데이터베이스에 있는 데이터를 조회하는 작업이다.
//UPDATE : 데이터베이스에 있는 데이터를 수정하는 작업이다.
//DELETE : 데이터베이스에 있는 데이터를 삭제하는 작업이다.

//CREATE(users 테이블과 comments 테이블에 데이터를 넣어보자)
//INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
//INSERT INRO nodejs.users (name, age, married, comment) VALUES ('nero', 32, 1, '자기소개2');
//INSERT INTO nodejs.comments (commenter, comment) VALUES (1, '안녕하세요, zero의 댓글입니다.');

//READ 작업하기
//SELECT * FROM nodejs.users;
//SELECT * FROM nodejs.comments;
//SElECT name, married FROM nodejs.users;
//SELECT name, age FROM nodejs.users WHERE married=1 AND age>30;
//SELECT id, name FROM nodejs.users WHERE married=0 OR age>30;
//SELECT id, name FORM nodejs.users ORDER BY age DESC;    (DESC:내림차순, ASC:오름차순)
//SELECT id, name FORM nodejs.users ORDER BY age DESC LIMIT 1;
//SELECT id, name FORM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;

//Update 수정하기
//UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

//DELETE 삭제하기
//DELETE FROM nodejs.users WHERE id = 2;

///////////////////////////////////////////
//시퀄라이즈 사용하기
//시퀄라이즈는 ORM(Object-relational Mapping)으로 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 
//도구이다.  (자바스크립트 구문을 알아서 SQL로 바꿔준다. 자바스크립트 언어도 MYSQL 컨트롤 가능)

//npm i express-generator 설치 후 
//express learn-sequelize --view=pug  로  시퀄라이즈를 설치하자
//cd learn-sequelize     
//npm i               
//npm i sequelize mysql2        (시퀄라이즈 와 mysql2 패키지 설치)
//npm i -g sequelize-cli         (sequelize 커맨드를 위한 sequelize-cli 전역설치)
//sequelize init                 (warning은 무시하자) config/config.json 파일을 만들어서 설정의 초기화

//models/index.js 파일을 수정해준다. (기존부분 주석처리 추가부분만 적기)

//MySQL 연결하기
//이제 시퀄라이즈를 통해 익스프레스 앱과 MySQL을 연결해야한다. app.js 에서 이와 관련된 것을 추가한다.

//모델 정의하기
//MySQL에서 정의한 테이블을 시퀄라이즈에서도 정의해야한다.(시퀄라이즈는 모델 - MySQL 테이블 을 연결해준다.) 
//models 폴더에 MySQL 테이블에 해당하는 users.js  comments.js 파일을 만들어주자!! 
//comments.js 를 만들때 테이블이 연결된 부분에 대한 정의가 없는걸 확인 할 수 있다.
//(이부분은 시퀄라이즈자체에서 가능하다.)

//모델을 정의했으면 models/index.js에서 테이블 정의한 파일들(users.js comments.js)과 연결하자
//config 폴더에 config.json 을 수정해보자
// development부분의 password = mysql root비번
//                  database = nodejs (DB schema 이름)
//                  operatorsAliases 는 보안에 취약한 연산자를 사용할지 여부를 설정하는 옵션이다.
//http://docs.sequelizejs.com/manual/querying.html  에서 operatorsAliases를 검색하면 나온다.
// const Op = Sequelize.Op;
// //use sequelize without any operators aliases
// const connection = new Sequelize(db, user, pass, { operatorsAliases: false });
// //use sequelize with only alias for $and => Op.and
// const connection2 = new Sequelize(db, user, pass, { operatorsAliases: { $and: Op.and } });
//Op.and / Op.or  === $and / $or     와 같은 의미이다.

// const Op = Sequelize.Op;
// const operatorsAliases = {
//   $gt: Op.gt
// }
// const connection = new Sequelize(db, user, pass, { operatorsAliases })
// [Op.gt]: 6 // > 6
// $gt: 6 // same as using Op.gt (> 6)


///////////////////////
//예시
// const Op = Sequelize.Op

// [Op.and]: {a: 5}           // AND (a = 5)
// [Op.or]: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
// [Op.gt]: 6,                // > 6
// [Op.gte]: 6,               // >= 6
// [Op.lt]: 10,               // < 10
// [Op.lte]: 10,              // <= 10
// [Op.ne]: 20,               // != 20
// [Op.eq]: 3,                // = 3
// [Op.not]: true,            // IS NOT TRUE
// [Op.between]: [6, 10],     // BETWEEN 6 AND 10
// [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
// [Op.in]: [1, 2],           // IN [1, 2]
// [Op.notIn]: [1, 2],        // NOT IN [1, 2]
// [Op.like]: '%hat',         // LIKE '%hat'
// [Op.notLike]: '%hat'       // NOT LIKE '%hat'
// [Op.iLike]: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
// [Op.notILike]: '%hat'      // NOT ILIKE '%hat'  (PG only)
// [Op.startsWith]: 'hat'     // LIKE 'hat%'
// [Op.endsWith]: 'hat'       // LIKE '%hat'
// [Op.substring]: 'hat'      // LIKE '%hat%'
// [Op.regexp]: '^[h|a|t]'    // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
// [Op.notRegexp]: '^[h|a|t]' // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
// [Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (PG only)
// [Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (PG only)
// [Op.like]: { [Op.any]: ['cat', 'hat']}
//                        // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
// [Op.overlap]: [1, 2]       // && [1, 2] (PG array overlap operator)
// [Op.contains]: [1, 2]      // @> [1, 2] (PG array contains operator)
// [Op.contained]: [1, 2]     // <@ [1, 2] (PG array contained by operator)
// [Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)

// [Op.col]: 'user.organization_id' // = "user"."organization_id", with dialect specific column identifiers, PG in this example
////////////////////////////////////


//index.js 에서 const env = process.env.NODE_ENV || 'development'; 이부분인데.. config.json의 속성과 연결된다.
//위의 설정은 process.env.NODE_ENV 가 development 일때 적용된다. 
//위의 설정은 config/config.json 의 속성들과 연결된다.(development,test,production) 개발용,테스트,배포용 이다.


//이제 users테이블 - comments 테이블을 연결해보자
//users의 사용자가 comments 댓글을 다는 것인데 한 사람이 댓글을 여러개 다는 구조이므로
//1:N의 구조이다.
//   1      :       N
//      (hasMany)
// Users  ----->   Comments
//      (belongs to)
// Users  <-----   Comments

//USers 테이블에서 comments 테이블의 데이터를 가져오는데 hasMany를 사용한다. (반대의 경우 belongs to 사용)
//models/index.js 에서 위의 메서드를 이용하여 연결시켜보자(연결 메소드 사용)

//1:1의 구조에서는 hasMany -> hasOne 을 하면된다. (hasOne, belongsTo 로 아무거나 연결하면 된다.)
//N:M의 구조에서는 양쪽 전부 belongsToMany메서드를 사용하면 된다.
//(자세한 내용은 교재 p277 을 보자)

// //시퀄라이즈 메서드를 이용하여 SQL 언어를 이용한 방법은 교재 p279를 보자
// //show datebases;        //DB를 찾는다.

// //show tables;           //DB안의 테이블들을 검색한다.

// //DESC 테이블이름;        //테이블이름이 가진 필드의 속성에 대해 나온다.

// //DROP TABLE 테이블이름;    //해당 테이블을 제거한다.

// // SQL <--> 시퀄라이즈 쿼리
//INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
// //시퀄라이즈 쿼리
// const {User} = require('../models');
// User.create({
//     name : 'zero',
//     age: 24,
//     married: false,
//     comment: '자기소개1',
// });

//SELECT * FROM nodejs.users;
// User.findAll({});

//SELECT * FROM nodejs.users LIMIT 1;
// User.find({});

//SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
// User.findAll({
//     attributes: ['name','age'],
//     where:{
//         married: 1,
//         age: {[Op.gt]:30}, //ES2015 문법이다.
//     },
// });

//ES2015문법은 아래와 같다.
//Op.gt(초과), Op.gte(이상), Op.lt(미만), Op.lte(이하), Op.ne(같지 않음), Op.or(또는)
//, Op.in(배열요소중 하나), Op.notIn(베열 요소와 모두 다름)

//SELECT id, name FROM users WHERE married=0 OR age>30;
// const {User, Sequelize:{Op}} = require('../models');
// User.findAll({
//     attributes:['id','name'],
//     where: {
//         [Op.or]: [{married:0},{age:{[Op.gt]:30}}],
//     },
// });

//SELECT id,name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
// User.findAll({
//     attributes: ['id','name'],
//     order: ['age','DESC'],
//     limit: 1,
//     offset: 1,
// });

//UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
// User.update({
//     comment: '바꿀 내용',
// }, {
//     where: {id:2},
// });

//DELETE FROM nodejs.users WHERE id=2;
// User.destroy({
//     where:{id:2},
// });


//////////////////////////////
//CRUD 만들어보기
//우선 views/sequelize.pug 파일에 화면 구성 코딩을 해보자
//그리고 public 폴더에 sequelize.js 를 만들어 화면과 서버간의 연결을 해보자
//이제 라우터들을 app.js 에 연결해주자 
//'/' 라우터에 GET POST PUT DELETE 요청에 해당하는 라우터를 만들어보자
// routes/index.js 에서 코드를 추가하자
// routes/users.js 에서 관련 코드를 추가하자
// (GEt /users와 POST/users 주소로 요청이 들어올때 라우터코드 추가 )
// routes/comments.js (댓글)파일을 만들어서 CRUD작업을 하자

//아래의 사항은 routes/comments.js 에서 아래의 사항을 사용한다.
//req.body에 대해
// Contains key-value pairs of data submitted in the request body. 
// By default, it is undefined, and is populated when you use body-parsing middleware 
// such as express.json() or express.urlencoded().
//req.params에 대해
// This property is an object containing properties mapped to the named route “parameters”. 
// For example, if you have the route /user/:name, then the “name” property is available as 
// req.params.name. This object defaults to {}.
//https://expressjs.com/en/api.html#req.params  <--about params

//HTTP메소드에 관한 설명은 아래에 있다. 나중에 좀 정리해두자
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods