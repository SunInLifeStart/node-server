const express = require('express');
const redis = require("../redis/redis");
// const FileUploadUtil = require('../tools/FileUploadUtil');
const router = express.Router();

/*添加新闻接口*/
router.post('/v1/portal/article', function(req, res) {
    if(!req.body.obj) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    saveNews(JSON.parse(req.body.obj)).then(function (result) {
        res.send(result);
    });
});

async function saveNews(news) {
    try {
        let id = await redis.set(1, "article", news);
        let tags = news.tags.split(",");
        for(var i in tags) {
            let obj = {title: news.title,time: news.time, img: news.img, about: news.about, publisher: news.publisher, articleId: id};
            await redis.zadd(1, tags[i], obj);
            await redis.zadd(1, "标签", tags[i]);
        }
        return "添加成功";
    } catch (e) {
        console.error(e.toString(),"=======================error");
        return e.toString();
    }
}

/**
 * plupload图片上传

router.post("/v1/portal/attachment", function (req, res) {
    FileUploadUtil.uploadImage(req, "files/", function (err, parames, images) {
        if(err || !images.length) {
            res.send({error: 1, msg: "上传失败"});
            return;
        }
        res.send({error: 0, msg: "上传成功", result: images[0]});
    });
});*/

module.exports = router;
