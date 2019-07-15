const storage = require('@google-cloud/storage')();
const gm = require('gm').subClass({ imageMagick: true }); 
//gm 패키지는 이미지 조작을 위한 패키지이다. imageMagick 방식으로 이미지를 리사이징하기 위해 
//subClass() 메서드로 imageMagick를 설정하였다.

//resizeAndUpload()함수가 Cloud Functions 호출시 싱행되는 함수이다.
//req,res 매개변수를 가지고 있는데 express와 유사한 기능읗 가진다.
exports.resizeAndUpload = (req, res) => {
  const { filename } = req.query;         //쿼리스트링으로 파일명을 가져온다.
  const bucket = 'node-deploy'; //프로젝트 버킷으로 바꿔주자
  if (!filename) {
    res.sendStatus(500).send('파일 이름을 쿼리스트링에 넣어주세요.');
    return;
  }
  //storage.bucket() 메서드로 버킷을 설정한 뒤, file() 메서드로 파일을 불러온다.
  const file = storage.bucket(bucket).file(filename);
  if (!file) {
    res.sendStatus(404).send('해당 파일이 없습니다.');
    return;
  }

  //Cloud Function에서는 파일을 스트림을 통해 불러오고 저장할 수 있다.
  //읽을 때는 createReadStream을 사용하고, 저장할때는 createWriteStream을 사용한다.
  const readStream = file.createReadStream();

  readStream.on('error', (err) => {
    console.error(err);
    res.sendStatus(err.code).send(err);
  });

  const newFile = storage.bucket(bucket).file(`thumb_${filename}`);
  const writeStream = newFile.createWriteStream();

  //gm() 함수에 파일 버퍼를 넣고, resize()로 크기를 정한다(세번째 옵션에 따라 리사이징한다.)
  //quality()는 화질을 결정한다. (90%로 설정함)
  //stream()은 리사이징된 이미지 결과를 스트림으로 출력하는 것이다.
  //pipe()로 리사이증된 이미지 스트림을 좀전에 만든 createWriteStream에 연결하였다.
  //스트림 전송이 끝나면 성공했다는 응답을 새 파일명과 함께 클라이언트에게 보낸다.
  gm(readStream)
    .resize(200, 200, '^')
    .quality(90)
    .stream((err, stdout) => {
      if (err) {
        console.error(err);
        return res.sendStatus(err.code).send(err);
      }
      stdout.pipe(writeStream);
      stdout.on('end', () => {
        res.send(`thumb_${filename}`);
      });
      return stdout.on('error', (err) => {
        console.error(err);
        res.sendStatus(err.code).send(err);
      });
    });
};
