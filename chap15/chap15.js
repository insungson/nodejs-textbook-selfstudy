//지금까지 서버 개발은 localhost에서만 진행을 하였다. 이제 다른 사람에게 내가 개발한 서비스를 공개하도록 만들어보자
//9장에서 배운 nodebird 앱을 배포해보자
//우선 배포하기 전 세팅을 작업에 대한 패키지설정을 알아보고
//아마존 웹서비스, 구글 클라우드 플랫폼으로 서비스 배포 방법을 배워보자

///////////////////////////////////
//서비스 운영을 위한 패키지
//서비스 출시 후서버에 문제가 생기면 서비스 자체에 심각한 타격을 입는다. 이 문제를 해결하는 패키지에 대해 알아보자

//////morgan과 express-session
//morgan은 로그 기능을 보여주는 모듈이다.

//app.js        에서 기존 morgan의 설정, session 옵션에 대한 설정을 바꿔보자

//////sequelize
//sequelize는 MySQL을 연결시켜주는 ORM이다.
//데이터베이스도 배포 환경으로 설정해야한다.
//sequelize의 가장 큰 문제는 비밀번호가 하드코딩되어 있다는 것이다. JSON 파일이므로 변수를 사용할 수 없다.
//sequelize는 JSON -> .js 파일로 설정 파일을 바꿔준다.

//config/config.json -> config/config.js        로 바꿔주고 내용을 바꾼다.

//.env          에서 config.json에서 sequelize를 사용할 수있는 password를 설정해준다.

//models/hashtag.js , post.js, user.js      모두 배포 환경에서 DB에 한글이 저장되지 않는 문제가 발생할
// 수 있기 때문에 문자열 UTF8(한글지원)으로 설정을 바꿔준다.

//////cross-env
//앞서 말한것 처럼 cross-env 패키지를 사용하면 동적으로 process.env를 변경할 수 있다.
//또한, 모든 운영체제에서 동일한 방법으로 변경할 수 있게 된다.
//(기존)
// "scripts": {
//     "start": "nodemon app"
//   },
//(변경)
// "scripts": {
//     "start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js -i 0",
//     "dev": "nodemon app"
//   },

//위에서 npm 스크립트를 2개로 나눴다.  npm start 는 배포환경에서 사용하는 스크립트이고,
//npm run dev는 개발 환경에서 사용하는 스크립트이다.
//NODE_ENV=production PORT=80 는 스크립트 실행 시 process.env를 동적으로 설정하는 방법이다.
//리눅스, 맥에서는 실행이 되지만 윈도우에선 NODE_ENV를 이렇세 설정할 수 없다.

//npm i -g cross-env && npm i cross-env         로 전역설치하고 기존의 설정앞에 cross-env를 붙여준다.
//cross-env NODE_ENV=production PORT=80 pm2 start app.js -i 0  로 바꿔준다.


//////retire
//설치된 패키지에 문제는 없는지 확인할 때 사용되는 패키지이다.

//npm i -g retire       로 retire를 설치한다.

//retire                로 실행하여 콘솔에서 확인한다.
//주기적으로 검사하여 취약점이 발견되면 패키지관련 페이지(github 페이지의 issue에서 관련 패키지의 소식을 보고)에
//가서 확인하고 업데이트를 해주면 된다.


//////pm2
//원활한 서버운영을 위한 패키지이다.
//개발 시 nodemon을 쓴다면, 배포시 pm2를 쓰면 된다. 가장 큰 기능은 서버가 에러로 인해 꺼졌을 때 서버를 다시 
//켜 주는 것이다.
//또 하나의 중요 기능은 멀티 프로세싱이다.
//멀티 프로세싱을 지원 (노드프로세스 개수를 1개 이상으로 가능) 자바스크립트는 싱글스레드 지원됨 
//CPU 코어를 하나만 사용하여 다른 코어들이 노는 일을 방지할 수 있다.
//노드는 클라이언트들로부터 요청이 왔을 때, 요청을 여러 노드 프로세스에 고르게 분배한다. 
//하나의 프로세스에 받는 부하가 적기 때문에 더 원활하게 서비스를 운영할 수 있다.
//단점은 멀티 스레딩이 아니기 때문에 서버의 메모리 같은 자원을 공유하지 못한다.
//(지금까지 세션을 메모리에 저장했는데, 메모리를 공유하지 못해서 프로세스 간에 세션이 공유되지 않는다.)
//예시) 세션 메모리가 있는 프로세스로 요청이 가면: 로그인 후 -> 새로고침 반복 -> 로그인 상태
//     세션 메모리가 없는 프로세스로 요청이 가면: 로그인 후 -> 새로고침 반복 -> 로그아웃 상태
//레디스(Redis)는 세션을 공유하기 때문에 위의 멀티 프로세스를 사용하더라도 멀티 스레드처럼 사용할 수 있다.

//npm i -g pm2          에서 pm2를 전역 설치한다.

//package.json          에서  아래처럼 pm2 부분을 추가해준다. (-i 0)의미는 -i 뒤에 생성하길 원하는 프로세스
//                      개수를 기입하면 딘다. 0은 현재 CPU코어 갯수만큼 프로세스를 생성한다는 뜻이다.
//                      -1은 프로세스를 CPU코어 개수보다 한개 덜 생성한다는 뜻이다.
//                      남은 코어는 노드 외의 다른 작업을 할 수 있게 하기 위함이다.
// "scripts": {
//     "start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js -i 0",
//     "dev": "nodemon app"
//   },

//npm start         로 실행하면 pm2 실행화면이 콘솔에 뜬다.

//pm2 list          를 실행하면 현재 실행중인 프로세스 정보가 표시된다.

//pm2 kill          을 실행하면 현재 실행중인 pm2 프로세스를 종료시키는 것이다.

//pm2 reload all        을 실행하면 서버를 재시작 할 수 있다.

//pm2 monit             을 실행하면 현재 프로세스를 모니터링 할 수 있다.


//////winston
//실제 서버 운영 시 console.log, console.error를 대체하기 위한 모듈이다.
//실제 서버를 운영할 때 서버가 종료되면 로그들이 사라지기 때문에 console.log, console.error를 확인하기 어렵다
//winston은 로그를 파일이나 DB에 저장하기 때문에 서버가 종료되어도 로그를 확인할 수 있다.

//npm i winston         으로 winston을 설치한뒤, logger.js를 작성한다.

//logger.js             에서 winston 패키지의 createLogger 메서드로 logger를 만든다.
//createLogger() 메서드의 옵션은 아래와 같다.
//level : 로그의 심각도를 의미한다. error, warn, info, verbose, debug, silly 가 있다.
//        심각도는 위의 순서이므로 기록하길 원하는 유형의 로그를 고르면 된다.
//        (info를 고를 경우, info보다 심각한 단계의 로그(error,warn)도 함께 기록된다.)
//format : 로그의 형식이다. (json, label, timestamp, printf, simple, combine) 등 다양한 형식이 있다.
//         기본적으로는 JSON형식을 사용하지만 로그 기록 시간을 표시할 땐 timestamp가 좋다.
//         combine은 여러 형식을 혼합해서 사용한다.
//transports : 로그 저장방식을 의미한다. 
//             new transports.File : 파일로 저장한다는 뜻이다.
//             new transports.Console : 콘솔에 출력한다는 뜻이다.

//app.js        에서 logger.js를 연결시키고 객치를 만들어서 info, warn, error 등의 메서드를 사용하면 
//              해당 심각도가 적용된 로그가 기록된다.

//npm run dev       명령어로 개발용 서버를 실행 후  http://localhost:8001/abcd  로 접속해보자
//error.log : error 단계의 로그만 기록한다.
//combined.log : info, error 단계의 로그가 저장된다.
//(winston-daily-rotate-file 패키지도 있다.)


//////helmet, hpp
//서버의 취약점을 보완해주는 패키지 들이다. (익스프레스 미들웨어로 사용할 수 있다.)
//helmet : HTTP 헤더를 적절히 설정하여 몇 가지 잘 알려진 웹 취약성으로부터 앱을 보호할 수 있습니다.
//https://expressjs.com/ko/advanced/best-practice-security.html 참조하자
//hpp : HTTP 변수의 오염으로 부터 보호해 주는 미들웨어이다.

//npm i helmet hpp      로 관련 패키지를 설치하고 

//app.js            에서 설치한 패키지들을 연결하자


//////connect-redis
//멀티 프로세스간 세션 공유를 위해 레디스(redis)와 익스프레스를 연결해주는 패키지이다.
//기존에는 로그인 시 express-session의 세션 아이디와 실제 사용자 정보가 메모리에 저장된다.
//그러므로 서버가 종료되면 메모리가 날라가 접속자들의 로그인이 모두 풀려버린다.
//이를 방지하기 위해 세션아이디, 실제 사용자 정보를 데이터베이스에 저장한다.
//이때 사용하는 데이터베이스가 레디스이다.

//npm i connect-redis       로 패키지를 설치하고, redislabs 웹 사이트에 접속해서 회원가입을 한다.(p581참조)
//https://redislabs.com/ 에서 회원가입

//.env          에서 REDIS_HOST, REDIS_PORT, REDIS_PASSWORD 를 입력한다.
//가입한 Redislabs 에서 Endpoint 에서 host, port에 복붙한다.(:뒤가 포트번호임) 
//그리고 Access Control & Security 에서 password에 붙여 넣는다.

//app.js        에서 위에서 패키지로 설치한 부분을 연결시키고, RedisStore 객체를 require하고 
//session 인자에 넣는다. (connect-redis는 express-session에 의존성이 있다.!!)
//express-session 미들웨어에 store 옵션을 추가한다.
//(옵션을 주기 전에는 메모리에 세션을 저장하지만, 이제는 RedisStore에 저장한다.)
//(RedisStore의 옵션으로  .env 에 저장했던 값들을 사용한다.  host, port, pass를 차례대로 넣어준다.)
//logErrors 옵션은 레디스에 에러가 났을 때 콘솔에 표시할지를 결정하는 옵션이다.
//!! 이제 세션 정보가 메모리 대신 Redis에 저장된다.
//이제 로그인 후 서버를 껐다 켜도 로그인이 유지된다.


//////nvm, n
//노드 버전을 업데이트하기 위한 패키지이다.
//윈도에서는 nvm-installer를 사용하고, 리눅스,맥에서는 n 패키지를 사용하면 편리하다

//https://github.com/coreybutler/nvm-windows/releases  에서 nvm-setup.zip을 받아서 설치한다.
//아... 나 이거 깔았었음...ㅠ.ㅠ 블로그에서 확인
//https://isinvest1.blogspot.com/2019/02/node-js-nvm.html  에서 확인하자

//콘솔에 아래의 명령어를 입력해서 사용한다
//nvm list                  설치된 노드 버전을 확인하는 명령어이다.
//nvm install [버전]        설치하고 싶은 노드버전을 설치한다.
//nmv use [버전]            설치된 노드 버전중 사용하고 싶은 버전을 사용하는 명령어이다.
//node -v                   현재 노드의 버전을 보여준다.

//리눅스, 맥은 n패키지를 사용한다.
//npm i -g n        으로 설치하고
//n                 은 설치된 노드 버전을 확인한다.
//n [버전]          은 그 버전을 설치한다.
//n latest          은 최신버전을 설치하게 된다.


///////////////////////////////////
//git과 github 사용하기
//소스코드는 Git이라는 분산형 버전 관리 시스템에서 업데이트한다.
//여기선 단순히 소스코드 업로드용으로만 사용하지만, 실무에서는 협업, 코드 롤백, 배포 자동화 등 
//다양한 곳에서 사용된다.
//github는 Git으로부터 업로드한 소스코드를 서버에 저장할 수 있는 원격저장소이다.

//git 설치하기 (p589부터)
//https://git-scm.com/downloads  여기서 git을 운영체제에 맞는것을 다운받는다.
//file:///C:/Program%20Files/Git/ReleaseNotes.html 설치 후 최신 소식을 볼 수 있었다.

//git --version         으로 설치된 깃버전을 확인할 수 있다.(버전이 뜨면 설치가 잘 된 것이다.)

//.gitignore            파일을 만든후 업로드 하지 않을 파일과 폴더를 설정한다.
//git으로 업로드를 할 때 추가하지 않겠다는 설명이다.
//(.env 파일은 실제 서비스에서는 비밀키가 노출되기 때문에 .env 파일은 git에 추가하면 안된다.)
//(배포용 서버에서 따로 .env 파일을 생성하여 비밀키를 적어주는것이 바람직하다.)

//github 홈피에 가서 가입을 하고 설정을 세팅한다(p592)

//git init          으로 현재 디렉터리를 Git 관리 대상으로 지정한다.

//git add .         으로 git add .(점)은 모든 파일을 추가하겠다는 의미이다. 

//이제 변경사항을 확정하는 명령어를 입력한다. 
//git은 파일이나 디렉터리를 추가 변경, 삭제한 후 확정지어야 다음단계로 넘어갈 수 있다.
//단, 확정하기 전에 누가 확정했는지를 기록해야 하므로 git config 명령어로 사용자의 이메일 주소,
//이름을 등록한다.  --아래는 위의 이유로 적음.

//git config --global user.email "libertines11@gmail.com"
//git config --global user.name "isinvest"
//git commit -m "Initial commit"
//-m 뒤의 문자열은 확정에 관한 설명 메시지이다. 

//git remote add [별명] [주소]         명령어로 git에 GitHub 주소를 등록하자
//git remote add origin https://github.com/isinvest/nodebird.git     을 입력한다.

//git remote -v                        현재 저장된 원격저장소 보기

//git remote rm <원격저장소이름 = 별명>    원격저장소로 등록한 이름과 주소 삭제

//git push -u origin master            으로 업로드를 하면 github repository에 올라온 것을 확인할 수 있다.

//**중요한건 웹에서 만든 public Repository와 여기서 git init으로 설정한 디렉터리의 이름이 같아야 한다.
//  또한 https://recoveryman.tistory.com/392  여기서 github에 올리기 위한 컴퓨터 자체 권한 설정을 해야한다.
//  제어판 -> 사용자계정 -> windows 자격 증명 관리 -> git:https://github.com 을 펼치기 누르고 -> 편집
//  -> github 에 접속하는 아이디, 패스워드를 적으면 된다. 

//@@@ 중요한 사실... (삽질좀 함..)
//chap9, 15를 깃허브에 올리는 실험을 하느라 git init 으로 .git 파일을 만든적이 있는데...
//이 경우 상위 폴더에서 git init으로 .git 파일을 만들어서 상위 하위에 각각 supermodule, submodule이 생긴다..
//서브버전과 구분되는 특성 중의 하나인데, 의도하지 않은 submodule은 처리가 귀찮다...
//전체를 하나의 프로젝트로 관리하고 싶다면 하위에 있는 .git 폴더들을 제거해보자.
//.git 을 상위에만 만드는 것이다.

/////////////////////////////////////
//AWS 시작하기
//((node버전이 12라서 bcrypt 빌드 에러가 생긴다... stable로 바꾸려고 해서 버전 변경 프로그램인 n을 설치해도
// 권한 밖이라고 안먹힌다... 이건 AWS로는 못할것 같다.))
//https://aws.amazon.com/ko/   에서 회원 가입을 하고 기본적인 세팅을 한다. (p600)
// https://swiftcoding.org/all-about-amazon-lightsail-billing  아마존 웹 서버 lightsail에 대한 
//요금 및 사용방법등 이 나와 있다. 참고하자

//** 무료 서비스
//Lightsail(AWS)은 비록 첫달은 무료지만, 매달 최소 $5의 요금이 부과된다.
//처음부터 무료로 배포할 수 있는 서비스를 찾는다면 Heroku(heroku.com)나 OpenShift(openshift.com)를 찾아보자
//AWS도 가입후 1년간 EC2 무료티어를 제공한다.
// 실습 후 삭제 메뉴에서 인스턴스를 삭제하여 요금이 부과되는 일이 없도록 하자!! 

//sequelize-cli         이 패키지는 기존에 sequelize를 설치하고 추후 설치하는 것으로 
//https://github.com/sequelize/cli   여기서 보면 여러가지 명령어가 있는데 

//예시)
//sequelize db:create           이런식으로 구성에 맞는 세부적인 데이터베이스가 만들어진다.
//                              콘솔에서 시퀄라이즈 명령으로 데이터베이스를 만든다.(다른건 위의 사이트 참조)








////////////////////////////////////////////////////
//GCP 시작하기 (구글 클라우드 플랫폼)
//https://console.cloud.google.com  에 접속해서 
//프로젝트를 새로 만든다. (p611)
//좌측 메뉴에서 Compute Engine 을 선택한다.
//VM 인스턴스에서 만들기를 누른다.
//머신 유형은 초소형(공유 vCPU 1개)으로 바꾼다.
//지역은 us-east1, us-central1, us-west1 중 하날 선택하고 (한국쪽 선택을 하면 속도는 좀더 빠르다)
//운영체제는 Ubuntu 16.04LTS 로 설정한다.
//방화벽은 HTTP   HTTPS 트래픽을 둘다 허용한다.
//만들기 버튼을 누르고 인스턴스 생성을 한다.

//생성된 인스턴스의 ssh를 누르면 크롬창에서 VM이 실행된다.
//이제 아래와 같이 리눅스에서 node, npm, mysql을 설치하고, 깃헙에 저장한 것을 가져와서 npm으로 설치하고
//sequelize-cli를 사용하여 데이터베이스를 만들면 된다.


////////리눅스에서 노드 및 npm 설치하기 (Ubuntu 16.04LTS 기준)///////////

//sudo apt-get update                           리눅스의 업데이트 목록 확인

//sudo apt-get install -y build-essential       리눅스의 필수 항목 설치(좀 걸림)(-y는 자동으로 yes 해줌)

//sudo apt-get install curl                     command line 용 data transfer tool 이다. 
//download/upload 모두 가능하며 HTTP/HTTPS/FTP/LDAP/SCP/TELNET/SMTP/POP3 등 주요한 
//프로토콜을 지원하며 Linux/Unix 계열 및 Windows 등 주요한 OS 에서 구동되므로 여러 플랫폼과 
//OS에서 유용하게 사용할 수 있다. 또 libcurl 이라는 C 기반의 library 가 제공되므로 C/C++ 프로그램
//개발시 위의 protocol 과 연계가 필요하다면 libcurl 을 사용하여 손쉽게 연계할 수 있다.

//curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash --      로 노드 10버전을 설치한다.
//여기서 s 옵션은 정숙 모드. 진행 내역이나 메시지등을 출력하지 않는다.
//       L 옵션은 서버에서 HTTP 301 이나 HTTP 302 응답이 왔을 경우 redirection URL 로 따라간다

//https://www.google.com/search?q=linux+install+node+10&oq=linux+install+node+10+&aqs=chrome..69i57j0l5.12594j0j4&sourceid=chrome&ie=UTF-8
//(구글링 해보니 설치방법이 나와있는데 위의 코드와 같다.)

//sudo apt-get install -y nodejs            로 다운 받은 node 10을 인스톨한다.

//node -v                   노드 버전확인

//npm -v                    npm 버전확인
//(npm install -g npm       npm의 버전을 최신으로 업데이트 해준다. 필요시 사용하자)


////////리눅스에서 MySQL 설치하기///////////

//sudo apt-get update               위에서 진행했기에 안해도 된다.

//sudo apt-get install -y mysql-server      로 mysql서버를 설치한다. (설치 후 password 설정을 한다.)

//mysql_secure_installation             으로 MYSQL을 설치하자
//아까 설정한 비번을 입력하면 VALIDATE PASSWORD 플러그인을 설치하냐고 묻는다. 
//n을 선택하고 엔터를 눌러 건너뛴다. (나중에 실제 서버 운영 시에는 설정해 주는게 좋다.)

//mysql -h localhost -u root -p         로 비번을 치고 들어가 mysql이 설치되었는지 확인해보자


////////리눅스에 나머지 작업하기//////////////

//git clone https://github/아이디/레파지토리            로 git에 올린 프로젝트를 가져오자

//cd 레파지토리                             가져온 프로젝트로 들어가자

//npm i                                    관련 패키지를 설치하자

//sudo npm i -g pm2 cross-env sequelize-cli     로 pm2, cross-env(process-env 동적으로 변경),sequelize-cli설치

//sequelize db:create --env production          좀전에 설치한 sequelize-cli 로 데이터베이스를 만든다.

//sudo npm start                            로 시작을 하고, VM인스턴스에 나와있는 외부 IP로 접속하면 누구든지 
//서비스를 이용할 수 있다.!! 
//(웹 서버와 DB 서버의 분리 : 지금은 웹서버와 DB서버를 같이 사용하지만 추후 나눠서 관리하는게 좋다.
//                           구글 클라우드 플랫폼은 Cloud SQL이라는 MySQL 전용 서비스를 따로 운영하고 있다.)

//인스턴스는 계속 사용하면 과금이 되기 때문에 실습 외엔 삭제해 두자


//리눅스에서 노드 버전 관리 https://brownbears.tistory.com/423 를 참고하자