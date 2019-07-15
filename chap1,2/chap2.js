// //const let
// //const : 기보넉으로 변수 선언 시 사용 (변경 불가)
// //let : 변수 선언시 사용 (변경 가능)
// const a =0;
// a =1;
// let b=0;
// b = 1;
// //Assignment to constant variable. 
// //에러발생


// //백틱 (`)
// var num1 =1, num2=2, result =3, string1;
// string1 = num1 + ` 더하기 ` + num2 + `는 ${result} 이다.`
// console.log(string1);
// //1 더하기 2는 3 이다.


// //객체리터럴
// var sayNode = function(){
//     console.log('Node');
// };
// var es = 'ES';
// /////////////옛날 방식
// var oldObject = {
//     sayJS : function(){
//         console.log('JS');
//     },
//     sayNode : sayNode, //위에서 정의한 메서드를 가져온다.
// };
// oldObject[es + 6] = 'Fantastic';
// oldObject.sayNode(); //Node
// oldObject.sayJS();  //JS
// console.log(oldObject.ES6); //Fantastic
// console.log(oldObject);
// // { sayJS: [Function: sayJS],
// //     sayNode: [Function: sayNode],
// //     ES6: 'Fantastic' }
// ///////////////바뀐 방식
// const newObject = {
//     sayJS(){
//         console.log('JS');
//     },
//     sayNode,   //객체 메서드를 붙일때 걍 갖다붙이면 된다.
//     [es+6] : 'Fantastic', //객체안에서 선언이 가능하다.
// };
// newObject.sayNode(); //Node
// newObject.sayJS();  //JS
// console.log(newObject.ES6); //Fantastic


// //화살표함수
// var relationship1 = {
//     name: 'zero',
//     friends: ['nero','hero','xero'],
//     logFriends: function(){
//         var that = this; //relationship1을 가르키는 this를 that에 저장
//         this.friends.forEach(function (friend) {
//             console.log(that.name, friend); 
//           });
//     },
// };
// relationship1.logFriends();
// // zero nero
// // zero hero
// // zero xero
// //logFriends메서드 안에서 각자 다른 스코프롤 가져서 that지정 relationship1
// //에 간접 접근하였다.

// const relationship2 = {
//     name : 'zero',
//     friends : ['nero','hero','xero'],
//     logFriends(){
//         this.friends.forEach(friend => console.log(this.name, friend));
//     },             //위처럼 화살표함수를 썻을때는 this를 바로 사용할 수 있다.
// };
// relationship2.logFriends();
// // zero nero
// // zero hero
// // zero xero
// //기본적으로 화살표 함수를 쓰되, this를 사용할 때는 화살표 함수와 
// //함수선언문(function()사용) 둘중 하나를 골라서 쓰자


// //비구조화 할당
// var candtMachine = {
//     status : {
//         name : 'node',
//         count : 5,
//     },
//     getCandy : function(){
//         this.status.count--;
//         return this.status.count;
//     }
// };
// //아래의 것은 
// var getCandy = candtMachine.getCandy;
// var count = candtMachine.status.count;
// //아래와 같이 바꿀 수 있다.
// const {getCandy, status:{count}} = candtMachine;
// //객체와 같은 형식으로 넣어야 한다.


// //프로미스
// //자바스크립트와 노드는 주로 비동기 프로그래밍을 한다.
// //특히 이벤트 주도 방식 때문에 콜백 함수를 자주 사용한다.
// //ES2015부터는 자바스크립트와 노드의 API들이 콜백 대신 프로미스(promise)
// //기반으로 재구성된다.
// //프로미스는 객체를 먼저 생성해야한다.
// //new promise로 프로미스를 생성한 후, 그 안에 resolve, reject를 매개변수로 갖는
// //콜백 함수를 넣어준다. promise 변수에 then(), catch()를 써서 
// //resolve 가 호출되면 -> then(), reject가 호출되면 -> catch()를 써서 매개변수를 받는다.
// //아래의 예를 보자
// const condition = true; //true면 resolve, false면 reject
// const promise = new Promise((resolve, reject) => {
//     if(condition){
//         resolve('성공');
//     }else{
//         reject('실패');
//     }
// });
// promise.then((message) => {
//     console.log(message); //성공(resolve)한 경우 실행
// })
// .catch((error) => {
//     console.log(error); //실패(reject)한 경우 실행
// });
// //또한 아래처럼 체인형식으로 계속 쓸 수 있다.
// promise.then((message) => {
//     return new Promise((resolve,reject) => {
//         resolve(message);
//     });
// })
// .then((message2) => {
//     return new Promise((resolve,reject) => {
//         resolve(message2);
//     });
// })
// .then((message3) => {
//     return new Promise((resolve,reject) => {
//         resolve(message3);
//     });
// })
// .catch((error) => {
//     console.error(error);
// })
// //처음 then에서 message를 resolve하여 then에서 받아 다시 message2를 resolve하여 
// //then에서 message3를 받았다.
// //콜백 -> 프로미스 의 예제를 보자
// //콜백함수
// function findAndSaveUser(User){
//     User.findOne({}, (err,user) => { //첫번째 콜백
//         if(err){
//             return console.error(err);
//         }
//         user.name = 'zero';
//         user.save((err) => {    //두 번째 콜백
//             if(err){
//                 return console.error(err);
//             }
//             User.findOne({gender: 'm'},(err,user)=>{ //세 번째 콜백
//                 //생략
//             });
//         });
//     });
// }
// //프로미스 함수
// function findAndSaveUser(Users){
//     User.findOne({})
//     .then((user) => {
//         user.name='zero';
//         return user.save();
//     })
//     .then((user)=>{
//         return User.findOne({gender : 'm'});
//     })
//     .then((user) => {
//         //생략
//     })
//     .catch(err => {
//         console.error(err);
//     });
// }
// //promise.all을 활용하면 비동기식으로 한번에 처리할 수 있다.
// //아래의 예를 보자
// const promise1 = Promise.resolve('성공1'); //Promise.resolve는
// const promise2 = Promise.resolve('성공2');//즉시 resolve하는 프로미스
// Promise.all([promise1,promise2])         //방법이다.
// .then((result) => {
//     console.log(result);
// })
// .catch((error) => {
//     console.error(error);
// });
// // [ '성공1', '성공2' ]
// //promise.all()에 배열로 다 넣으면 모두 resolve될때까지 기다렸다가 
// //then으로 넘어간다. result 매개변수에 각각의 프로미스 결과값이 들어있다.


// //async/await
// //프로미스가 콜백 헬을 해결했지만, 여전히 코드는 길고 복잡하다.  
// //async/await는 코드를 깔끔하게 해준다.
// //기존의 프로미스코드
// function findAndSaveUser(Users){
//     Users.findOne({})
//     .then((user) => {
//         user.name = 'zero';
//         return user.save();
//     })
//     .then((user) => {
//         return Users.findOne({gender:'m'});
//     })
//     .then((user) => {
//         //생략
//     })
//     .catch(err => {
//         console.error(err);
//     });
// }
// //위의 프로미스 코드를 async await를 사용해보자
// async function findAndSaveUser(Users){
//     let user = await Users.findOne({});
//     user.name = 'zero';
//     user = await user.save();
//     user = await Users.findOne({gender : 'm'});
//     //생략
// }
// //위의 코드는 에러처리가 없기 때문에 try catch를 써보자
// async function findAndSaveUser(Users){
//     try{
//         let user = await Users.findOne({});
//         user.name = 'zero';
//         user = await user.save();
//         user = await Users.findOne({gender : 'm'});
//         //생략
//     }catch(error){
//         console.error(error);
//     }
// }
// //위의 코드를 화살표 함수로 바꿔보자
// const findAndSaveUser = async (Users) => {
//     try{
//         let user = await Users.findOne({});
//         user.name = 'zero';
//         user = await user.save();
//         user = await Users.findOne({gender : 'm'});
//         //생략
//     }catch(error){
//         console.error(error);
//     }
// }
// //앞에서 봤던 promise.all에 async await를 넣어보자 (ES2018부터 사용되는 문법이다.)
// const promise1 = Promise.resolve('성공1'); //Promise.resolve는
// const promise2 = Promise.resolve('성공2');//즉시 resolve하는 프로미스
// Promise.all([promise1,promise2])         //방법이다.
// .then((result) => {
//     console.log(result);
// })
// .catch((error) => {
//     console.error(error);
// });
// // [ '성공1', '성공2' ]
// //위의 것을 async로 바꿔보자
// const promise1 = Promise.resolve('성공1');
// const peomise2 = Promise.resolve('성공2');
// (async() => {
//     for await (promise of [promise1, promise2]){
//         console.log(prmise);
//     }
// })();
// //promise.all -> for await of 바꿔보았다.
// //앞으로 콜백함수 -> 프로미스 -> async/await 로 바꾸는 연습을 해보자
// // 위의 과정을 연습해서 익숙해지는 것이 중요하다.


//Ajax
//비동기적 웹 서비스를 개발하기 위한 기법이다.
//AJAX 요청은 꼭XML을 사용하는게 아니다. 요즘엔 JSON을 많이 사용한다.
//페이지의 이동없이 서버에 요청을 보내고 응답을 받는 기술이다.
//(웹 사이트 중 페이지 전환없이 새로운 데이터를 불러오는 사이트는 대부분 AJAX를 사용한다.)
//test.html 을 보자


//data attribute와 dataset
//노드를 웹서버로 사용할 때, 클라이언트(프런트엔드)와 빈번하게 데이터를 주고받게 된다.
//이때 서버에서 보내준 데이터를 저장해야하는데 보안에 대해 생각을 해야한다.
//HTML과 관련된 데이터를 저장하는 공식적인 방법은 data attribute를 사용하는 것이다.
//data attribute의 장점은 자바스크립트로 쉽게 접근할 수 있다는 점이다. 
//data_attributeAndDataset.html를 보면 dataset속성을 통해 첫번째 li태그의 data attribute에
//접근하고 있다.  다만 웹상의 콘솔창에서 뜨는 data attribute는 좀 변형되었다.
//data-id -> id, data-user-job -> userJob 으로 변경되었다. (코드상 -> 콘솔창)
//dataset.변수이름.값   을 하면 변수이름=값  이 들어간다.