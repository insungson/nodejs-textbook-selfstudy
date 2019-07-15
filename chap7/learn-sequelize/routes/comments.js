var express = require('express');
var {User, Comment} = require('../models');

var router = express.Router();

router.get('/:id', function(req,res,next){
    Comment.findAll({
        include: {
            model: User,
            where: {id: req.params.id},
        },
    })
    .then((comments) => {
        console.log(comments + '이건뭘까?');
        res.json(comments);
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    });
})
// 댓글을 생성하는 라우터이다.
router.post('/', function(req,res,next){
    Comment.create({    //SQL의 INSERT INTO와 같다.
        commenter: req.body.id,  //commenter 속성에 사용자 아이디를 넣어 사용자와 댓글을 연결해준다.
        comment: req.body.comment,
    })
    .then((result)=>{
        console.log(result);
        res.status(201).json(result);
    })
    .catch((err)=>{
        console.error(err);
        next(er);
    });
});

router.patch('/:id', function(req,res,next){
    Comment.update({ comment: req.body.comment }, { where: {id:req.params.id}} ) 
        .then((result) => {
            res.json(result);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

router.delete('/:id', function(req,res,next){
    Comment.destroy({where: {id:req.params.id}})
        .then((result)=>{
            res.json(result);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        });
});

module.exports = router;