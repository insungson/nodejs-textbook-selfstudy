///////////////////////////////////////////////////
//XMLHttpRequest 객체를 통한 통신 방법을 알아보자 (chap4 REST API 부분과 같이 보면 좋다)
//(http://tcpschool.com/ajax/ajax_server_xmlhttprequest)
//XMLHttpRequest 객체는 웹 브라우저가 서버와 데이터를 교환할 때 사용된다
//웹 브라우저가 백그라운드에서 계속해서 서버와 통신할 수 있는 것은 바로 이 객체를 사용하기 때문이다.

//서버에 요청(request)하기
//1. XMLHttpRequest 객체를 사용하여 서버와 데이터를 교환한다.
//2. 따라서 서버에 요청을 보내기 위해서는 우선 XMLHttpRequest 인스턴스를 생성해야 한다.
//3. XMLHttpRequest 인스턴스의 open() 메소드와 send() 메소드를 사용하여 요청을 보낼 수 있다.

//open() 매소드
//open(전달방식, URL주소, 동기여부);
//전달 방식: 요청을 전달할 방식으로 GET 방식과 POST 방식 이 있다.
//URL 주소: 요청을 처리할 서버의 파일 주소를 전달한다
//동기 여부: true(비동기식), false(동기식)

//send() 메소드
//send() 메소드는 작성된 Ajax 요청을 서버로 전달한다.
//이 메소드는 전달 방식에 따라 인수를 가질 수도 안 가질 수도 있다.
//send();       // GET 방식
//send(문자열); // POST 방식

//GET 방식과 POST 방식
//GET 방식: 주소에 데이터(data)를 추가하여 전달한다.
//GET 방식의 HTTP 요청은 브라우저에 의해 캐시되어(cached) 저장된다.
//또한, GET 방식은 보통 쿼리 문자열(query string)에 포함되어 전송되므로, 길이의 제한이 있다.
//따라서 보안상 취약점이 존재하므로, 중요한 데이터는 POST 방식을 사용하여 요청하는 것이 좋다.
//POST 방식: 데이터(data)를 별도로 첨부하여 전달하는 방식이다.
//POST 방식의 HTTP 요청은 브라우저에 의해 캐시되지 않으므로, 브라우저 히스토리에도 남지 않는다.
//또한, POST 방식의 HTTP 요청에 의한 데이터는 쿼리 문자열과는 별도로 전송된다.
//따라서 데이터의 길이에 대한 제한도 없으며, GET 방식보다 보안성이 높다.

//GET 방식으로 요청하기
//브라우저에서 서버에 GET 방식의 요청을 다음과 같이 보낸다
//이때 서버로 전송하고자 하는 데이터는 URI(:id 같은 방식)에 포함되어 전송된다.
// GET 방식으로 요청을 보내면서 데이터를 동시에 전달함.
//httpRequest.open("GET", "/examples/media/request_ajax.php?city=Seoul&zipcode=06141", true);
//httpRequest.send();
//위의 예제에서 사용된 다음 코드로 XMLXttpRequest 객체의 현재 상태와 서버 상의 문서 존재 유무를 확인할 수 있다.
// if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200 ) {
//     ...
// }
//readyState 프로퍼티의 값이 XMLHttpRequest.DONE이면, 서버에 요청한 데이터의 처리가 완료되어 응답할 준비가 
//완료되었다는 의미
//status 프로퍼티의 값이 200이면, 요청한 문서가 서버 상에 존재한다는 의미

//POST 방식으로 요청하기
//브라우저에서 서버에 POST 방식의 요청을 다음과 같이 보낸다.
//이때 서버로 전송하고자 하는 데이터는 HTTP 헤더에 포함되어 전송된다.
//따라서 setRequestHeader() 메소드를 이용하여 먼저 헤더를 작성한 후에, send() 메소드로 데이터를 전송하면 된다.
// POST 방식의 요청은 데이터를 Http 헤더에 포함시켜 전송함.
// httpRequest.open("POST", "/examples/media/request_ajax.php", true);
// httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// httpRequest.send("city=Seoul&zipcode=06141");


//서버로부터의 응답

//서버로부터의 응답(response) 확인
//서버로부터의 응답을 확인하기 위해 사용하는 XMLHttpRequest 객체의 프로퍼티는 다음과 같다.
//1. readyState 프로퍼티
//2. status 프로퍼티
//3. onreadystatechange 프로퍼티

//readyState 프로퍼티
//readyState 프로퍼티는 XMLHttpRequest 객체의 현재 상태를 나타낸다.
//이 프로퍼티의 값은 객체의 현재 상태에 따라 다음과 같은 주기로 변화한다.
// 1. UNSENT (숫자 0) : XMLHttpRequest 객체가 생성됨.
// 2. OPENED (숫자 1) : open() 메소드가 성공적으로 실행됨.
// 3. HEADERS_RECEIVED (숫자 2) : 모든 요청에 대한 응답이 도착함.
// 4. LOADING (숫자 3) : 요청한 데이터를 처리 중임.
// 5. DONE (숫자 4) : 요청한 데이터의 처리가 완료되어 응답할 준비가 완료됨.

//status 프로퍼티
//status 프로퍼티는 서버의 문서 상태를 나타낸다.
//- 200 : 서버에 문서가 존재함.
//- 404 : 서버에 문서가 존재하지 않음.

//onreadystatechange 프로퍼티
//onreadystatechange 프로퍼티는 XMLHttpRequest 객체의 readyState 프로퍼티 값이 변할 때마다 
//자동으로 호출되는 함수를 설정한다. (onload 로 대체할수 있다. 자세한건 아래 설명)
//(chap1,2의 test.html 참조)
//이 함수는 서버에서 응답이 도착할 때까지 readyState 프로퍼티 값의 변화에 따라 총 5번 호출된다.
//이 프로퍼티를 이용하면 서버에 요청한 데이터가 존재하고, 서버로부터 응답이 도착하는 순간을 특정할 수 있다.
// switch (httpRequest.readyState) {
//     case XMLHttpRequest.UNSET:
//         currentState += "현재 XMLHttpRequest 객체의 상태는 UNSET 입니다.<br>";
//         break;
//     case XMLHttpRequest.OPENED:
//         currentState += "현재 XMLHttpRequest 객체의 상태는 OPENED 입니다.<br>";
//         break;
//     case XMLHttpRequest.HEADERS_RECIEVED:
//         currentState += "현재 XMLHttpRequest 객체의 상태는 HEADERS_RECEIVED 입니다.<br>";
//         break;
//     case XMLHttpRequest.LOADING:
//         currentState += "현재 XMLHttpRequest 객체의 상태는 LOADING 입니다.<br>";
//         break;
//     case XMLHttpRequest.DONE:
//         currentState += "현재 XMLHttpRequest 객체의 상태는 DONE 입니다.<br>";
//         break;
// }

// document.getElementById("status").innerHTML = currentState;
// if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200 ) {
//     document.getElementById("text").innerHTML = httpRequest.responseText;
// }

////////////////////////////////////////////////////
//https://www.zerocho.com/category/HTML&DOM/post/594bc4e9991b0e0018fff5ed
//AJAX 요청
//AJAX 요청을 보내는 대표적인 방법인 XMLHttpRequest(XHR) 사용 방법에 대해서 알아보겠습니다.
//보통 Ajax 통신은 아래와 같이 이뤄진다.

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() { // 요청에 대한 콜백
  if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
    if (xhr.status === 200 || xhr.status === 201) {
      console.log(xhr.responseText);    //responseText로 서버에서 데이터의 값을 받는다.
    } else {
      console.error(xhr.responseText);
    }
  }
};
xhr.open('GET', 'https://www.zerocho.com/api/get'); // 메소드와 주소 설정
xhr.send(); // 요청 전송 
// xhr.abort(); // 전송된 요청 취소

//굳이 순서를 따지면 아래코드에서 요청이 되고 -> 위의 코드에서 요청이 완료되고 
//-> 확인이 되면 서버에서 데이터를 받는다.

//onreadystatechange가 요청에 대한 응답을 받는 이벤트 리스너인데요. 
//먼저 readyState에 대해서 아셔야 합니다. AJAX 요청 시 XHR 객체는 각 상태별로 readyState가 바뀝니다. 
//처음에는 readyState가 0(xhr.UNSENT, 보내지 않음)이었다가, 
//open 메소드를 호출하는 순간 1(xhr.OPENED)로 바뀝니다. 
//그리고 send 시 순차적으로 2(xhr.HEADERS_RECEIVED), 3(xhr.LOADING), 4(xhr.DONE)로 바뀝니다.

//readyState가 바뀔 때마다 onreadystatechange에 설정해두었던 콜백 함수가 호출됩니다. 
//최종적으로 readyState가 4(xhr.DONE)가 되었을 때 요청이 완료가 된 것이기 때문에 
//이제 xhr.status로 HTTP 상태 코드를 확인하고요. 
//상태 코드가 성공을 가리키는 200이나 201일 때 응답을 확인합니다. 아니면 에러를 표시합니다. 
//readyState가 바뀌는 것은 onreadystatechange 안에 다음 코드를 추가하면 실시간으로 확인하실 수 있습니다.
if (xhr.readyState === xhr.UNSENT) {
    console.log('unsent');
}
if (xhr.readyState === xhr.OPENED) {
    console.log('opened');
}
if (xhr.readyState === xhr.HEADERS_RECEIVED) {
    console.log('headers received');
}
if (xhr.readyState === xhr.LOADING) {
    console.log('loading');
}


//**onreadystatechange 대신에 onload를 사용해도 됩니다. 요청 완료만 잡아내도 된다면요.
//가장 먼저 GET 메소드일 때 XHR로 요청을 보내보겠습니다. 
//GET 요청은 HTTP 스펙 상 body에 데이터를 보내면 안 됩니다. 
//데이터를 굳이 보내고 싶다면 주소에 쿼리스트링을 붙여 보내시면 됩니다.

//GET 요청인 아래의 예를 보자
var xhr = new XMLHttpRequest();
xhr.onload = function() {
  if (xhr.status === 200 || xhr.status === 201) {
    console.log(xhr.responseText);
  } else {
    console.error(xhr.responseText);
  }
};
xhr.open('GET', 'https://www.zerocho.com/api/get?name=zerocho');
xhr.send();

//POST 요청인 아래의 예를 보자
//POST 방식은 주로 JSON을 보내거나 FormData를 body에 실어 보냅니다 
//먼저 JSON 방식을 보자 (GET 방식과 비슷한데 POST 방식은 헤더에 데이터를 실어서 보낸다.)
var xhr = new XMLHttpRequest();
var data = {
  name: 'zerocho',
  birth: 1994,
};
xhr.onload = function() {
  if (xhr.status === 200 || xhr.status === 201) {
    console.log(xhr.responseText);
  } else {
    console.error(xhr.responseText);
  }
};
xhr.open('POST', 'https://www.zerocho.com/api/post/json');
xhr.setRequestHeader('Content-Type', 'application/json'); // 컨텐츠타입을 json으로
xhr.send(JSON.stringify(data)); // 데이터를 stringify해서 보냄

//이제 FormData를 보자
//별도로 header 설정을 할 필요 없이 그냥 formData를 보내주면 됩니다
//자동으로 Content-type이 multipart/form-data가 됩니다.
//이미지나 파일도 저렇게 formData에 넣어서 보내주면 됩니다.
var xhr = new XMLHttpRequest();
var formData = new FormData();
formData.append('name', 'zerocho');  //append(key,value) 로 해당 객체에 값을 추가한다.
formData.append('birth', 1994);
xhr.onload = function() {
  if (xhr.status === 200 || xhr.status === 201) {
    console.log(xhr.responseText);
  } else {
    console.error(xhr.responseText);
  }
};
xhr.open('POST', 'https://www.zerocho.com/api/post/formdata');
xhr.send(formData); // 폼 데이터 객체 전송

//FormData는 https://www.zerocho.com/category/HTML&DOM/post/59465380f2c7fb0018a1a263  여기서 참조하자
//FormData의 메서드 몇개만 알아보자
//append(키,값) : 해당 키에 해당하는 값을 추가해준다. (같은 키가 있을 경우 데이터가 추가된다.)
//has(키) : 해당 객체가 키값을 가지고 있는지 확인해준다. (리턴을 true, false)
//get(키) : 해당 객체의 키에 대해 값을 리턴해준다.(값이 여러개라면 처음저장된 1개만 가져온다)
//getAll(키) : 해당 객체의 키에 대한 모든 값을 리턴해준다.
//set(키,값) : 객체의 키에 해당하는 곳의 값을 덮어쓴다. (기존의 값들이 날라가고 새로입력됨)
formData.has('item'); // true
formData.has('money'); // false
formData.get('item'); // orange
formData.getAll('item'); // ['orange', 'melon']
formData.append('test', ['hi', 'zero']);
formData.get('test'); // hi, zero
formData.delete('test');
formData.get('test'); // null
formData.set('item', 'apple');
formData.getAll('item'); // ['apple']

//Fetch API 를 사용해서 위의 XHR 을 대체할 수 있다.
//https://www.zerocho.com/category/HTML&DOM/post/595b4bc97cafe885540c0c1c 에서 자세한걸 확인할 수 있다.