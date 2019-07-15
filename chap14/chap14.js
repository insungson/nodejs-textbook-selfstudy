//npm, nodemon 같은 커맨드라인에서 노드프로그램을 만들어보자
//윈도 같은 GUI가 아닌 리눅스 같은 CLI 프로그램을 만들어보자

//간단한 콘솔 명령어 만들기
//보통 노드 파일을 실행할 때 node [파일명]  으로 노드 프로그램을 실행했다.
//npm, nodemon 처럼 콘솔창에서 자체 명령어를 실행할 수 있는 패키지를 만들어보자
//여기선 노드를 이용한 논리적인 프로그램을 만드는 것이다.

//node-cli          폴더를 만들고
//package.json      에서 만들 패키지의 기본사항을 적어보자
//index.js          에서 콘솔에서 명령어 실행 시 뜨는 문구를 적어보자
////#!/usr/bin/env node는 리눅스나 맥 같은 운영체제에서 의미가 있다
// 윈도우에서는 그냥 주석에 불과하다. /usr/bin/env 파일을 node로 실행하라는 의미

//package.json      에서 bin 속성은 콘솔 명렁어와 해당 명령어 호출 시 실행파일을 설정하는 객체이다.
// cli 는 콘솔 명령어이고 실행할 파일은 index.js로 지정했다.

//npm i -g          로 지금 설정한 것을 패키지로 설치해보자

//template.js       에서 폴더와 파일을 만드는 코드를 구현해보자
//readline 모듈에서 question() 메서드가 비동기 방식으로 동작하므로 새로운 함수들을 만들었다.
//실제 실행되는 순서는 typeAnswer, nameAnswer, directAnswer 순으로 실행된다.

//커맨드창을 열어서 프로그램을 실행하자(visual code 터미널에선 실행이 안된다.)


/////////////////////////////////////////////////////
//Commander, Inquirer 사용하기
//(npm 에는 CLI 프로그램을 위한 라이브러리가 많다. yargs, commander, meow 가 있다.)
//이제 앞에서 만든 것을 node-cli1 폴더에서 만들어보자

//commander는 사용방법이 직관적이고, inquirer은 CLI 프로그램과 사용자간의 상호작용을 돕는다.
//chalk는 콘솔 텍스트의 스타일을 추가한다.

//npm i commander inquirer chalk            로 해당 패키지를 설치한다.

//command.js            에서 해당 코딩을 하자
//commander 패키지의 옵션에 대해 알아보자
//version : 프로그램의 버전에 대한 설정을 한다. 첫번째인자에 버전을 넣고, 두번째 인자에 버전을 보여줄 옵션을 넣는다.
//          여러개의 경우 ,로 구분하고 --version으로 지정되어있고(commander에 작성한 코드상에서), -v는 축약어이다.
//usage : 이 메서드는 명렁어의 사용법을 설정할 수 있다. 명령어의 사용법은 명령어에 (-h, --help)를 붙일때 작동된다. 
//        [option]에서 []는 필수가 아닌 선택이라는 뜻이다.
//command : 명령어를 설정하는 메서드이다. 현재 template <type>과 *명령어 두개를 설정하였다. 
//          이때 cli command html 과 같이 명령할 수 있는데 html은 <type>에 대응된다. 
//          <>은 필수적인 의미로 type을 넣지 않으면 에러가 발생한다. 
//          *는 와일드카드 명령어로 나머지 모든 명령어를 의미한다. (template를 제외한 다른 명령어 입력시 실행)
//description : 명령어에 대한 설명을 설정하는 메서드이다. (명령어 설명서에 표시된다.)
//alias : 명령어의 별칭을 설정할 수 있다. template 명렁어의 별칭이 tmpl로 설정되어 있으므로 cli template html
//        대신 cli tmpl html도 실행가능하다.
//option : 명령어에 대한 부가적인 옵션을 설정할 수 있다.  
//         여기서 template는 파일명(--name),생성경로(--directory) 옵션을 가진다.  
//         첫번째 인자는 옵션명령어이고, 두번째 인자는 옵션에 대한 설명, 세번째 인자는 옵션의 기본값이다.
//         (옵션을 입력하지 않은 경우 기본값 적용)
//action : 명령어에 대한 실제 동작을 정의하는 메서드이다.<type> 같은 필수 요소나 옵션들을 매개변수로 가져올수 있다.
//help : 설명서를 보여주는 옵션이다. -h, --help 옵션으로 설명서를 볼 수 있고, 이 메서드를 사용해 프로그래밍적
//       으로 표시할 수도 있다.
//parse : program 객체의 마지막에 붙이는 메서드이다. progress.argv를 인자로 받아서 명령어와 옵션을 파싱한다.

//command.js            에서 template.js 에서 동작하는 코드들을 가져와서 완성시키자
//template.js에서 관련 함수를 변수화 하여 command.js 에 넣는다.(action 부분에 추가함)

//이제 cli template html -d public/html -n new      에서 public/html/new.html 이 만들어진다.
//여전히 commander를 사용하더라도 여전히 명령어를 외워야 한다... 
//이제 inquirer로 cli 명령어 사용 시 질의응답 형식으로 사용자와 상호할 수 있도록 만들어보자
//inquirer의 옵션을 알아보자
//(inquirer 객체는 prompt라는 메서드를 가지고 있다. 이 메서드는 promise()를 통해 then()을 통해
//답변(answer객체)을 리턴한다.)
//type: 질문의 종류이다. input, checkbox, list, password, confirm 등이 있다. 
//      (이 예제에서는 input(평범한 답변), list(다중 택일), confirm(YES or NO) 종류의 질문 사용)
//name: 질문의 이름이다. 나중에 답변 객체가 속성명으로 질문의 이름을, 속성값으로 질문의 답을 가지게 된다.
//message: 사용자에게 표시되는 문자열이다. 여기서 실제 질문을 적으면 된다.
//choices: type이 checkbox, list 등 인 경우 선택지를 넣는 곳이다. 배열로 넣어주면 된다.
//default: 답을 적지 않는 경우 적용되는 문자열이다.

//command.js        에서 이제 chalk 패키지를 사용하여 터미널에 색과 스타일을 추가해보자
//chalk 패키지의 사용법 및 옵션에 대해 알아보자
//사용법은 chalk 객체의 메서드들로 문자열을 감싸면 된다.
//green, yellow, red, blue 같이 바로 써도 적용이 되고, 
//chalk.rgb(12,34,56)(텍스트) 또는 chalk.hex(#123456)(텍스트) 같이 사용할 수도 있다.
//bold(굵게), underline(밑줄) 같은 스타일도 지정 가능하다. 
//예시) chalk.red,bgBule.blod(텍스트)       처럼 동시에 사용하면 된다.

//5장에서 배운 npm 배포를 통해 이 프로그램을 배포할 수도 있다.



///////////////////////////////////////////////////
//node-cli 폴더의 templete.js 에서 코드를 보자

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


//위의 사항에서 답변을 html, moonshit, ../moon 을 입력할때 관련 콘솔에 대해 위의것을 찍어봤는데 아래같이 나왔다
//dir : ../moon
//dirname : ['..','moon']
//pathBuilder : ..
//pathBuilder : ..\moon
//dirname.foreach() : ['..', 'moon']