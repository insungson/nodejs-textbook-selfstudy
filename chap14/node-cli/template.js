#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';   //|| : logical or 의미

//생성할 HTML 템플릿이다.
const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Template</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>`;

//생성할 라우터 템플릿이다.
const routerTemplate = `const express = require('express');
const router = express.Router();
 
router.get('/', (req, res, next) => {
   try {
     res.send('ok');
   } catch (error) {
     console.error(error);
     next(error);
   }
});
 
module.exports = router;`;

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;  //fs.accessSync() 로 파일이나 폴더가 존재하는지 확인을 한다.
  } catch (e) {
    return false;
  }
};

//폴더를 만드는 변수이다.
//현재 경로와 입력한 경로의 상대적인 위치를 파악한 후(relative()), 
//순차적으로 상위폴더부터 만들어간다.(mkdirsync())
const mkdirp = (dir) => {   //relative(1,2) 는 1~2까지의 현재 디렉토리에 기반해서 relative path를 리턴한다.
  console.log('dir : ',dir);
  const dirname = path
    .relative('.', path.normalize(dir))       //path.normalize()는 잘못된 경로를 바르게 바꿔준다.
    .split(path.sep)                          //path.sep : '/' '\' 같은 구분이다.
    .filter(p => !!p);                        //! : logical not 의미
    console.log('dirname : ',dirname);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep); // /\ 같은 폴더 경로의 구분을 해준다.
    console.log('pathBuilder : ',pathBuilder);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
  console.log('dirname.foreach() :', dirname);
};
//path.normalize('C:\\temp\\\\foo\\bar\\..\\');
//// Returns: 'C:\\temp\\foo\\'  (이렇게 .. 같은 잘못된 경로가 들어가면 올바르게 바꿔준다)

//path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
//// Returns: '..\\..\\impl\\bbb'   (이런식으로 첫번쨰 기준 두번째로 상대적인 경로를 보여준다)

//템플릿을 만드는 함수를 변수화 한 것이다.
//유효한 명령어가 들어왔다면 디렉터리를 만든 후, type(html또는 express-router)에 따라 파일을 만들고 파일안에
//템플릿을 만든다.
const makeTemplate = () => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다');
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다');
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else {
    console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
  }
};

const dirAnswer = (answer) => {
  directory = (answer && answer.trim()) || '.';
  rl.close();
  makeTemplate();
};

const nameAnswer = (answer) => {
  if (!answer || !answer.trim()) {
    console.clear();
    console.log('name을 반드시 입력하셔야 합니다.');
    return rl.question('파일명을 설정하세요. ', nameAnswer);
  }
  name = answer;
  return rl.question('저장할 경로를 설정하세요.(설정하지 않으면 현재경로) ', dirAnswer);
};

const typeAnswer = (answer) => {
  if (answer !== 'html' && answer !== 'express-router') {
    console.clear();
    console.log('html 또는 express-router만 지원합니다.');
    return rl.question('어떤 템플릿이 필요하십니까? ', typeAnswer);
  }
  type = answer;
  return rl.question('파일명을 설정하세요. ', nameAnswer);
};

const program = () => {
  if (!type || !name) {    //명령어에서 템플릿 종류(type), 파일명(name)을 입력하지 않았을 때 
    rl = readline.createInterface({   //상호작용할 수 있는 입력창을 띄우는 부분이다.
      input: process.stdin,
      output: process.stdout,
    });
    console.clear();
    rl.question('어떤 템플릿이 필요하십니까? ', typeAnswer);
  } else {
    makeTemplate();
  }
};

program();