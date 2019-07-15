const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken, deprecated} = require('./middlewares');
const {Domain,User,Post,Hashtag} = require('../models');

const router = express.Router();

router.use(deprecated); //기존의 라우터들 앞에서 use()를 써서 post,get 방식 전부 적용되게 한다.
                        //app.use() 가아닌 router.use()임..
//토큰을 발급하는 라우터(POST  /v1/token)
router.post('/token', async(req,res)=>{
    const {clientSecret} = req.body;
    try{
        const domain = await Domain.find({
            where:{clientSecret},
            include:{
                model: User,
                attribute:['nick','id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code:401,
                message: '등록되지 않은 도메인입니다.먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({ //jwt.sign 메서드로 토큰을 발급할 수 있다.
            id: domain.user.id,         //첫번째인자: 토큰의 내용
            nick: domain.user.nick,     //두번째인자: 토큰의 비밀키
        }, process.env.JWT_SECRET,{     //세번째인자: 토큰의 설정
            expiresIn: '1m',    //토큰 유효기간
            issuer:'nodebird',  //토큰 발급자
        });
        return res.json({
            code:200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message:'서버에러',
        });
    }
});
//여기는 그냥 서버에서의 테스트
router.get('/test', verifyToken, (req,res)=>{ //사용자가 발급받은 토큰은 미들웨어에서 검증을하고 성공시
    res.json(req.decoded);                    //토큰의 내용물을 응답으로 보내준다.
});

//여기는 API로서 다른 클라이언트 서버로 보내는정보
router.get('/posts/my', verifyToken, (req,res)=>{
    Post.findAll({where:{userId: req.decoded.id}})
        .then((posts)=>{
            console.log(posts);
            res.json({
                code:200,
                payload:posts,
            });
        })
        .catch((error)=>{
            console.error(error);
            return res.status(500).json({
                code:500,
                message:'서버에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, async(req,res)=>{
    try{
        const hashtag = await Hashtag.find({where:{title:req.params.title}});
        if(!hashtag){
            return res.status(404).json({
                code: 404,
                message: '검색결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code:200,
            payload: posts,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code:500,
            message:'서버에러',
        });
    }
});

module.exports = router;

//라우터 응답형태는 json 형식으로 code, message르 포함하고 있다.