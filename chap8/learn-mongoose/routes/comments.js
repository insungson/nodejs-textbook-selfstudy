var express = require('express');
var Comment = require('../schemas/comment');

var router = express.Router();
//게시글 다큐먼트 조회
router.get('/:id', function(req,res,next){
    Comment.find({commenter: req.params.id}).populate('commenter') //댓글을 쓴 사용자의 아이디로 댓글을 조회한 후
        .then((comments)=>{         //populate()는 관련있는 컬렉션의 다큐먼트를 불러올 수 있다. Comment 스키마
            console.log(comments);  //commenter 필드의 ref가 User로 되어 있으므로 알아서 users 컬렉션에서 
            res.json(comments);     //users 컬렉션에서 사용자 다큐먼트를 찾아 합친다.
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

//다큐먼트를 등록
router.post('/', function(req,res,next){
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    comment.save()
        .then((result)=>{       //프로미스의 결과로 리턴된 result객체를 popular() 로 User 스키마와 합쳤다.
            return Comment.populate(result, {path:'commenter'});
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

//다큐먼트를 수정한다.
router.patch('/:id', function(req,res,next){
    Comment.update({_id: req.params.id},{comment: req.body.comment}) //update()의 첫번째 인자는 수정할 
        .then((result) => {     //쿼리 객체에 대해, 두번째 인자는 수정할필드와 값을 나타낸다.
            res.json(result);   //$set 연산자 없이 필드를 바꿔준다. (실수로 다큐먼트를 전부 바꾸지 않는다.)
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

//다큐먼트를 삭제한다.
router.delete('/:id', function(req,res,next){
    Comment.remove({_id: req.params.id})
        .then((result)=>{
            res.json(result);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

module.exports = router;