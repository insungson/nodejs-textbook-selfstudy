//mongoDB 를 설치 한 후 
//mongo를 실행한다.
//use [데이터베이스]     로 데이터베이스를 만든다.
//use nodejs     로 nodejs 데이터베이스를 만들자
//show dbs    로 데이터베이스 목록을 확인하자 (하지만 nodejs가 목록에 없다.)
//db     를 입력하면 현재 사용하고 있는 db가 나온다.
//db.createCollection('users')
//db.createCollection('comments')      로 컨랙션을 생성하자
//show collections       로 생성한 목록을 확인하자!
//몽고DB 터미널 창에서 아래의 명령어를 입력하여 값을 넣어보자
//use nodejs
//몽고디비의 CRUD에 대해 살펴보자
//CREATED(생성)
//db.users.save({name: 'zero', age: 24, married: false, comment: '안녕하세요. 간단히 몽고디비에 대해 알아봅시다.', createdAt: new Date()});
//db.users.save({name: 'nero', age: 32, married: true, comment: '안녕하세요. zero친구 nero입니다.', createdAt: new Date()});
//de.컬렉션명.save(다큐먼트)        로 다큐먼트를 생성할 수 있다.
//db.users.find({name:'zero'},{_id:1})    로 입력한 객체의 id 번호를 알아내자 이후 이것과 연결시켜서 comments를 추가시키자
//db.comments.save({commenter:ObjectId('위의 id숫자'), comment:'안녕하세요.zero의 댓글입니다.', createdAt: new Date()});
//READ(조회)
//db.users.find({});    로 전체를 조회해보자
//db.comments.find({});   
//db.users.find({},{_id:0, name:1, married:1});      **여기서 뒷부분의 {}는 각 요소들로 _id는 객체번호 이다.0일때 출력X 1일때 출력O라는 뜻이다.
//db.users.find({age:{$gt:30}, married:true},{_id:0,name:1,age:1});
//위의 연산자는 다음과 같다. $gt:초과, $gte:이상, $lt:미만, $lte:이하, $ne:같지않음, $or:또는, $in:배열요소 중 하나
//db.user.find({$or:[{age:{$gt:30}},{married:false}]}, {_id:0,name:1,age:1});
//db.users.find({},{_id:0,name:1,age:1}).sort({age:-1})      sort로 정렬을 할 수 있다. -1은 내림차순 1은 오름차순이다.
//db.users.find({},{_id:0,name:1,age:1}).sort({age:-1}).limit(1).skip(1)  //limit는 죄회갯수, skip은 건너뛰는 갯수이다.
//UPDATE(수정)
//db.users.update({name:'nero'},{$set:{comment:'안녕하세요. 이필드를 바꿔보겠습니다!'}});
//위의 첫번째{} 는 수정할 다큐먼트를 지정하는 객체이고, 두번째{}는 수정할 내용을 입력하는 객체이다.
//$set을 설정해야 원하는 부분만 수정이 가능하다. $set이 없다면 두번째{}로 전체가 수정된다.
//DELETE(삭제)
//db.users.remove({name:'nero'})

//https://mongoosejs.com/docs/api/query.html#query_Query-lte 이부분을 단어로 찾아서 사용해보자
////////////////////////////////////////
//mongoose 사용하기
//노드와 mysql과 연결시킬때 사용했던 것이 sequelize 였다면   노드 mongo를 연결시킬때 사용하는 것은 mongoose이다.
//몽고디비는 데이블이 없어서 자유롭게 데이터를 넣을 수도 있지만, 때로는 불편함을 야기시킨다.
//실수로 잘못된 자료형데이터를 넣거나 다른 다큐먼트에 없는 필드의 데이터를 넣을수도 있기 때문이다.

//express learn-mongoose --view=pug    로 express 프로젝트를 만들자
//해당 폴더로 들어가서 npm 패키지들을 설치해보자
//cd leanr-mongoose 
//npm i 
//npm i mongoose       mongoose를 설치하자

//이제 노드 - 몽고디비  를 연결해보자
//루트폴더에 schemas 폴더를 만들고 index.js 파일을 만든 후 코드를 쳐보자
//몽구스와 몽고디비를 연결한다. 그리고 User, Comment 스키마를 연결한다.

//app.js에서 schemas/index.js - app.js 를 연결하여  노드 실행 시 mongoose.connect 부분도 실행되도록 한다.
//이제 schemas/user.js    schemas/comment.js   를 만들어서 시퀄라이즈처럼 테이블을 만들어보자
//위는 몽구스모듈 Schema 생성자를 사용하여 스키마를 만든 것이다. 
//(마지막의 model메서드로  스키마-몽고디비 컬렉션 을 연결한다.)
//schema객체를 정의할때 unique속성을 true로 할 경우 그 컬럼에 고유의 값을 주게 한다.
//여러 문서에서 나오는 해당 필드에 들어있는 각 값은 유일하다. (그 필드를 document_id 가아닌 그필드로 조회가능)
//https://avilos.codes/database/mongodb/mongoose-document-control/
//https://alexband.tistory.com/24
//require속성은 필수적으로 입력해야한다고 지정한것이다.
//https://docs.mongodb.com/manual/core/index-unique/  (이 문서는 너무했깔린다. 나중에 내공이쌓이면보자)

//views/mongoose.pug 파일을 만들어 화면구성을 만든다.

//public/mongoose.js 파일을 만들어 화면의 작동을 설정한다.
//화면을 클릭시 서버의 라우터로 AJAX요청을 보내는 코드들이다.

//https://www.w3.org/Protocols/HTTP/HTRESP.html       <<= http statuscode 관련 정리

//이제 라우터를 만들어보자
//routes/index.js     GET방식의  /주소로 접속했을때의 라우터이다.
//User.find({}) 메서드로 모든 사용자를 찾은 뒤, mongoose.pug를 랜더링할 때 users 변수로 넣어준다.

//routes/comments.js   에서 댓글에 대한 코딩을 하자
//이제 등록한 라우터들을 서버와 연결하자
//app.js 에 코드를 수정하고 추가하자

//routes/comments.js    에서의 populate 사용방법은  
//https://mongoosejs.com/docs/populate.html    여기를 보면 나와있다.


////////////////////////////////////
//event.preventDefault() 에 대한것
//https://ismydream.tistory.com/98   참조하기
//