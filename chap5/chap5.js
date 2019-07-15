//npm은 다른 프로그래머가 작성한 코드를 손쉽게 사용할 수 있다.

//npm을 패키지화 하여 사용해보자
//콘솔에 npm init을 입력하여 pakage.json을 만들어보자
//목록들을 차래대로 입력하면 package.json 파일이 생성된다.
//express를 설치해보자 npm install express를 입력하면 express가 설치된다.
//설치하면 package.json 파일과 package-lock.json 파일이 생성된다. package.json은 npm으로 설치한 모듈이고
//package-lock.json은 node_modules 연결된 세부 모듈까지 보여준다.
//npm install [패키지1] [패키지2] [패키지3]    을 입력하면 패키지1,2,3이 한번에 설치된다.

//pacage.json에 dependencies(배포용)와 devDependencies(배포x 개발중 사용가능) 두개가 있다.
//npm install --save-dex [패키지] [...]      는 실제 배포 시에는 사용되지 않고, 개발 중에만 사용되는
//패키지 들이다.

//npm install --save-dev nodemon 을 설치해보자(nodemon : 소스코드가 바뀔 때마다 자동으로 노드를 재실행)

//npm install --global [패키지]    는 npm이 설치된 폴더(보통 시스템 환경변수에 등록됨)에 설치되어 
//전역 패키지처럼 다른 환경에서도 쓸 수 있다. (전역으로 패키지를 설치하면 package.json에 따로 보여지지 않는다.)

//npm install --global rimraf   를 설치해보자(rimraf는 리눅스에서 사용되는 rm -rf명령어를 윈도에서 사용가능)
//npx 명령어를 사용하여 전역 패키지를 설치한것처럼 사용할 수도 있다.
//npm install --save-dev rimraf    로 설치 한후 
//npx rimraf node_modules          로 실행하면 패키지를 전역 설치한것과 같은 효과를 볼 수 있다.

//npm install [깃허브 주소]      로 누군가의 오픈 프로젝트를 가져올 수도 있다.
//npm install === npm i 
//npm install --save-dev === npm i -D
//npm install --global === npm -g
//위의 3개는 명령어 축약어들


//SemVer(Semantic Versioning)유의적 버전 :버전을 구성하는 세자리에 의미가 있다.
//1.2.3 에서 
//첫번쨰 자리 1은 major 버전이다. 0이면 초기단계 1부터 정식 버전이다. 
//(1.5.0버전 쓰는 사람이 2.0.0에선 에러가 발생할수 있다.)
//두번째 자리 2는 minor 버전이다.  하위호환되는 기능을 업데이트할때 사용
//세번째 자리 3은 patch 버전이다. 새로운 기능이 추가된것 보단 기존 기능에 문제가 있을때 수정한 것

//npm i express^1.1.1   에서 ^의 의미는 1.1.1 <= 버전 <2.0.0 까지 설치된다는 의미이다.
//npm i express@~1.1.1  에서 ~의 의미는 1.1.1 <= 버전 <1.2.0 까지 설치된다는 의미이다.
//npm i express@latest  는 나온것 중 최신 버전의 패키지를 사용한다는 의미이다.

//npm outdated : npm 설치된 패키지 중 업데이트 할 수 있는 패키지가 있는지 확인해 보는 것이다.
//npm update : npm update를 하면 업데이트 가능한 모든 패키지가 wnadted에 적힌 버전으로 업데이트 된다.
//npm update [패키지] : 입력한 패키지만 업데이트 된다.
//npm rm [패키지]     or     npm uninstall [패키지] : 해당 케피지를 삭제한다. 

//npm info [패키지]  : 패키지에 대한 상세 정보를 보여준다.
//npm adduser       는 npm에 로그인을 위한 명령어이다. 

//패키지 배포 부분은 교재 p178부터 살펴보자