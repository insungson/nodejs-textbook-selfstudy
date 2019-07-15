//사용자 이름을 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach(function(el){
    el.addEventListener('click', function(){
        var id = el.querySelector('td').textContent;
        getComment(id);
    });
});

//사용자 로딩
function getUser(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 200){
            var users = JSON.parse(xhr.responseText);
            console.log(users);
            var tbody = document.querySelector('#user-list tbody');
            tbody.innerHTML = '';
            users.map(function(user){
                var row = document.createElement('tr');
                row.addEventListener('click', function(){
                    getComment(user._id);
                });

                var td = document.createElement('td');
                td.textContent = user._id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.name;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.age;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.married ? '기혼':'미혼';
                row.appendChild(td);

                tbody.appendChild(row);
            });
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET','/users');
    xhr.send();
}

//댓글 로딩
function getComment(id){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 200){
            var comments = JSON.parse(xhr.responseText);  //문자열 -> JSON 형태
            var tbody = document.querySelector('#comment-list tbody');
            tbody.innerHTML = '';
            comments.map(function(comment){
                var row = document.createElement('tr');

                var td = document.createElement('td');
                td.textContent = comment._id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.commenter.name; //이부분 문자열로 해서 확인해보기
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.comment;
                row.appendChild(td);
                var edit = document.createElement('button');
                edit.textContent = '수정';
                edit.addEventListener('click', function(){      //수정 클릭 시
                    var newComment = prompt('바꿀 내용을 입력하세요!'); 
                    //prompt()는 방문자를 위한 input dialog를 호출한다. 
                    //첫번째는 설명,두번째 인자는 dialog의 input부분에 그인자가 들어간다.
                    if(!newComment) alert('내용을 반드시 입력하셔야 합니다.');
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function(){
                        if(xhr.status === 200){
                            console.log(xhr.responseText);
                            getComment(id);
                        }else{
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('PATCH', '/comments/'+comment._id);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({comment:newComment})); //이부분 좀 햇깔린다.
                });
                var remove = document.createElement('button');
                remove.textContent = '삭제';
                remove.addEventListener('click', function(){  //삭제 클릭 시
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function(){
                        if(xhr.status === 200){
                            console.log(xhr.responseText);
                            getComment(id);
                        }else{
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('DELETE', '/comments/'+comment._id);
                    xhr.send();
                });
                td = document.createElement('td');
                td.appendChild(edit);
                row.appendChild(td);

                td = document.createElement('td');
                td.appendChild(remove);
                row.appendChild(td);

                tbody.appendChild(row);
            });
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET','/comments/'+id);
    xhr.send();
}

//사용자 등록 시
document.getElementById('user-form').addEventListener('submit', function(e){
    e.preventDefault(); //다른 쓸때 없는 동작을 막기위한 설정 chap8.js에서 확인
    var name = e.target.username.value; //tartget event가 실행될때 해당된 element를 리턴해준다.
    var age = e.target.age.value;
    var married = e.target.married.checked; //HTML 와꾸에서 check 형태이기 때문에 이렇게 받음.
    if(!name) alert('이름을 입력하세요!');
    if(!age) alert('나이를 입력하세요!');
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 201){
            console.log(xhr.responseText);
            getUser();
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/user');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({name:name,age:age,married:married}));
    //데이터를 보내고 다시 초기값으 돌리기 위한 코드
    e.target.username.value='';
    e.target.age.value='';
    e.target.married.checked=false;
});

//댓글 등록 시
document.getElementById('comment-form').addEventListener('submit',function(e){
    e.preventDefault();
    var id = e.target.userid.value;
    var comment = e.target.comment.value;
    if(!id) alert('아이디를 입력하세요!');
    if(!comment) alert('댓글을 입력하세요!');
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 200){
            console.log(xhr.responseText);
            getComment(id);
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/comments');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({id:id,comment:comment}));
    //데이터를 보내고 다시 초기값으로 돌리기 위한 코드
    e.target.userid.value='';
    e.target.comment.value='';
});