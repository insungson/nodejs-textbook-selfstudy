//서버리스 이해하기
//서버를 클라우드 서비스가 대신 관리해줘서 개발자나 운영자가 서버를 관리하는데 드는 부담이 줄어든다는 의미이다.

//AWS에서 Lambda, S3
//GCP에서 Cloud Function, Cloud Storage

//일단 GCP만 실행해보자
//(p644 에서 참조)
//JSON키 값까지 가져온다.

//15장의 nodebird를 가져와서 작업하자
//npm에서 multer에서 Cloud Storage로 업로드할 수 있게 해주는 multer-google-storage 패키지를 설치한다.
//json 파일을 다운 받아서 프로젝트 폴더에 넣는다.

//npm i multer-google-storage axios     로 설치해준다(axios는 HTTP 통신을 원활하게 해주는 javascript이다.)

//nodebird/routes/post.js               에서 아까 설치한 multer-google-storage를 연결하도록 수정한다.
//multer 함수의 옵션에서 storage 속성을 multerGoogleStorage로 교체한다.
//(내부 bucket,projectId, keyFilename <-> googleproject의 버킷명, 프로젝트ID, 키 파일명)으로 설정하면 된다.

/////////////////// Google Cloud Function 사용하기
//(p649 를 확인하면 내용 이해가 쉽다.)
//Cloud Functions는 하나의 노드 패키지라고 생각하면 된다.
//gcp-upload 폴더를 생성한 뒤 그안에 package.json을 작성하고 npm으로 패키지를 설치한다.

//gcp-upload/index.js           에서 google cloud function에 올릴 로직 코드를 적는다.
//코드 작성 후 gcp-upload 폴더를 zip파일로 압축하고, Cloud Function에 올리고 그곳의 URL주소를 복사한 뒤

//nodebird/routes/post.js       에서 axios.get()메서드의 주소 URL에 넣는다.
//(함수 필요시 그 URL로 요청하고 함수의 리턴값을 storage에 요청해서 받은 값을 브라우저에 띄워준다.)

//nodebird/views/main.pug       에서 이미지 업로드와 화면 처리 부분을 수정해준다.