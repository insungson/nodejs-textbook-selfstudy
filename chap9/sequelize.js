//http://webframeworks.kr/tutorials/expressjs/expressjs_orm_one/
//http://webframeworks.kr/tutorials/expressjs/expressjs_orm_two/
//http://webframeworks.kr/tutorials/expressjs/expressjs_orm_three/
//http://webframeworks.kr/tutorials/expressjs/expressjs_orm_four/
//https://nodejs.org/api/process.html#process_process_config

//ORM이란?
//-> Object Relational Mapping 의 약자로 application - Database의 맵핑을 시켜주는 도구이다.
// 한층 더 추상화된 layer에서 Database에 대한 작업을 할 수 있게 해준다
//ORM 사용의 장점
//1. 특정 DBMS에 종속되지 않는다.
//2. SQL문이 코드에 들어가지 않아 깔끔한 코드를 유지할 수 있다.
//3. ORM이 nestinf데이터를 바인딩해준다.
//ORM 사용의 단점
//1. RAW query에 비해 performence가 느리다.
//2. Query turning이 힘들다.
//3. 서비스가 복잡해 질수록 ORM으로 할 수 있는 작업의 범위에 한계가 있다.

//NodeJS에서 가장 많이 사용되는 ORM은 Sequelize이다. (PostgreSQL, MySQL, MariaDB, SQLite, MSSQL)
//(http://docs.sequelizejs.com/manual/dialects.html)  <-- 여기 자세하게 나와있다. 
//자바스크립트의 대표적 비동기 방식인 promise를 사용한다. 
//(복잡한 비동기 코드를 간편하게, Chaining작업 가능, Error handling 가능)
//npm으로 sequelize를 설치하고
//models/index.js에서 DB 설정을 한다.
//(new Sequelize(database, [username=null], [password=null], [options={}]) 코드로 설정을 한다.) 
//config/config.json에서 DB 종류 table이름 비번을 적고 index.js랑 연결을 한다.
//models/user.js,post.js,hashtag.js 에서 modeldefine 데이터베이스의 정의를 한다.(테이블 정의이다.)
//sequelize.define(모델이름,실제 table schema맵핑정보, config 옵션) 에서 
//첫번쨰는 모델의 이름이고 두번째는 실제 table schema와 맵핑되는 정보이다.
//대표적인 설정을 몇개 보자
    // type : Data type
    // primaryKey : 기본키 인지 아닌지 설정 (default: false)
    // autoIncrement : SERIAL(auto increment)인지 아닌지 (default: false)
    // allowNull : NOT NULL 조건인지 아닌지 (default: true)
    // unique : Unique조건인지 아닌지에 대한 옵션. column하나로만 이루어진 unique라면 true/false로 지정한다. 
    //          복수개의 column이라면 동일한 문자열을 각 column의 unique속성에 넣어준다.
    // comment : column에 대한 comment
    // validate : 각 column에 대한 validation check옵션을 넣어준다.
//세번째는 config 옵션이 들어간다. 대표적인 옵션은 아래와 같다
    // timestamps : Sequelize는 테이블을 생성한 후 자동적으로 createdAt, updatedAt column을 생성한다. 
    //              Database에 해당 테이블이 언제 생성되었고 가장 최근에 수정된 시간이 언제인지 추적할 수 
    //              있도록 해준다. 기능을 끄려면 false로 설정한다.
    // paranoid : paranoid가 true이면 deletedAt column이 table에 추가된다. 
    //            해당 row를 삭제시 실제로 데이터가 삭제되지 않고 deletedAt에 삭제된 날짜가 추가되며 
    //            deletedAt에 날짜가 표기된 row는 find작업시 제외된다. 즉 데이터는 삭제되지 않지만 
    //            삭제된 효과를 준다. timestamps 옵션이 true여야만 사용할 수 있다.
    // underscored : true이면 column이름을 camalCase가 아닌 underscore방식으로 사용한다.
    // freezeTableName : Sequelize는 define method의 첫번째 파라미터 값으로 tablename을 자동변환하는데 
    //                   true이면 이작업을 하지 않도록 한다.
    // tableName : 실제 Table name
    // comment : table 에 대한 comment
//sequelize의 데이터 타입을 알아보자
// Sequelize.STRING                      // VARCHAR(255)
// Sequelize.STRING(1234)                // VARCHAR(1234)
// Sequelize.STRING.BINARY               // VARCHAR BINARY
// Sequelize.TEXT                        // TEXT

// Sequelize.INTEGER                     // INTEGER
// Sequelize.BIGINT                      // BIGINT
// Sequelize.BIGINT(11)                  // BIGINT(11)

// Sequelize.FLOAT                       // FLOAT
// Sequelize.FLOAT(11)                   // FLOAT(11)
// Sequelize.FLOAT(11, 12)               // FLOAT(11,12)

// Sequelize.REAL                        // REAL        PostgreSQL only.
// Sequelize.REAL(11)                    // REAL(11)    PostgreSQL only.
// Sequelize.REAL(11, 12)                // REAL(11,12) PostgreSQL only.

// Sequelize.DOUBLE                      // DOUBLE
// Sequelize.DOUBLE(11)                  // DOUBLE(11)
// Sequelize.DOUBLE(11, 12)              // DOUBLE(11,12)

// Sequelize.DECIMAL                     // DECIMAL
// Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

// Sequelize.DATE                        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
// Sequelize.BOOLEAN                     // TINYINT(1)

// Sequelize.ENUM('value 1', 'value 2')  // An ENUM with allowed values 'value 1' and 'value 2'
// Sequelize.ARRAY(Sequelize.TEXT)       // Defines an array. PostgreSQL only.

// Sequelize.JSON                        // JSON column. PostgreSQL only.
// Sequelize.JSONB                       // JSONB column. PostgreSQL only.

// Sequelize.BLOB                        // BLOB (bytea for PostgreSQL)
// Sequelize.BLOB('tiny')                // TINYBLOB (bytea for PostgreSQL. Other options are medium and long)

// Sequelize.UUID                        // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: Sequelize.UUIDV1 or Sequelize.UUIDV4 to make sequelize generate the ids automatically)

// Sequelize.RANGE(Sequelize.INTEGER)    // Defines int4range range. PostgreSQL only.
// Sequelize.RANGE(Sequelize.BIGINT)     // Defined int8range range. PostgreSQL only.
// Sequelize.RANGE(Sequelize.DATE)       // Defines tstzrange range. PostgreSQL only.
// Sequelize.RANGE(Sequelize.DATEONLY)   // Defines daterange range. PostgreSQL only.
// Sequelize.RANGE(Sequelize.DECIMAL)    // Defines numrange range. PostgreSQL only.

// Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // Defines array of tstzrange ranges. PostgreSQL only.

//Sync()를 통해 테이블 model을 정의한 부분을 DataBase의 테이블들을 동기화 할 수 있다.
//미들웨어를 관리하는 app.js에서 sequelize.sync(); 을 통해 동기화작업을 할 수 있다.
//Sync()의 반대작업은 Drop()이고 drop()을 하면 table을 삭제할 수 있다.

//Sequelize의 SELECT, INSERT, UPDATE, DELETE를 사용하여 query문을 대신하여 작성해보자

//Select의 모델메서드
//  findAll : 조선에 맞는 모든 row를 찾아 리턴한다. 만약 row가 없다면 빈 배열을 리턴한다.
//  findOne, find : 조건에 맞는 row중 한개만 리턴한다.(limit 1을 적용한것과 같다)
//                  primary key 조건에 의해 검색할 때 row가 한개만 검색되게 하는게 좋다.
//                  (row가 없으면 null을 리턴한다.)
//  count : 조건에 맞는 row의 갯수를 리턴한다.
//  findAndCount : 조건에 맞는 결과와 함께 row count를 함께 리턴한다. (findAll + count 조합이다.)
//find,findAll의 옵션에 대해 알아보자
//  where : where옵션은 SQL문에서 where에 해당하는 부분을 기술하는 옵션이다.
//  attributes: table의 특정 column만 select할 때 사용
//  order: SQL문의 order by에 해당하는 부분을 기술하는 옵션이다.
//  limit, offset: SQL문의 limit, offset에 해당하는 부분을 기술하는 옵션

//INSERT의 모델메서드
//routes/auth.js 부분에 create 부분이 나온다. 
//(여기선 find where로 이멜이 같으면 안되고 row가 없을 때 create()로 데이터를 insert한다.)

//UPDATE의 모델메서드
//where을 통해 해당 row를 찾아서 update()로 데이터를 수정해준다.

//DELETE의 모델메서드
//where를 통해 해당 row를 찾아서 destroy()로 해당 row를 삭제한다.

//테이블간 연결메서드는 아래와 같다
//1. BelongsTo
//2. HasOne
//3. HasMany
//4. BelongsToMany

//1 : 1 관계
//user.hasOne(post);
//post.belongsTo(user); 

//1 : N 관계
//user.hasMany(post,{foreignKey:'commenter', sourceKey:'id'});  //hasMany에선 sourceKey
//post.belongsTo(user,{foreignKey:'commenter', targetKey:'id'}); //belongsTo에선 targetKey 를 쓴다.

//N : M 관계(서로 다른 테이블끼리 여러개 겹칠때)
//user.belongsToMany(post,{through: 'PostHashTag'}); //through 속성에 PostHashTag를 적어서 새롭게 모델을
//post,belongsToMany(user,{through: 'PostHashTag'}); //만들고, 이 모델을 매개로 연결이 된다.

//N : N 관계(서로 같은 테이블끼리 연결할때) (models/index.js 의 코드)
//user.belongsToMany(user, {foreignKey: 'followingId', as: 'Followers', through: 'Follow'});
//user.belongsToMany(user, {foreignKey: 'followerId', as: 'Followings', through: 'Follow'});
//as 옵션은 모델의 관계를 맺을때 이름을 새롭게 짓고 싶으면 as를 사용
//through 는 관계형 테이블 이름
//foreignKey 는 테이블에 생성될 foreignKey 필드이다.

