const express = require('express');
const redis = require("../redis/redis");
// const FileUploadUtil = require('../tools/FileUploadUtil');
const router = express.Router();

/* 通知公告详情 */
router.get('/v1/portal/details', function (req, res) {
    redis.get(0, "article:" + req.query.id).then(function (data) {
        data = JSON.parse(data);
        res.send({error: 0, msg: '获取成功', data});
    }).catch(function (error) {
        res.send({error: 1, msg: '获取失败，',error});
    });
});

/* 通知公告列表 */
router.get('/v1/portal/noticeBulletin', function (req, res) {
    redis.zrevrange(0, "通知公告", [0, 4, 'withscores']).then(function (data) {
        for(let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log(data, "===========================");
        res.send({error: 0, msg: '获取成功', data});
    }).catch(function (error) {
        res.send({error: 1, msg: '获取失败，',error});
    });
});

/*添加企业门户统计接口*/
router.post('/v1/portal/statistics', function(req, res) {
    if(!req.body.totalAssets || !req.body.fundedProjects || !req.body.serviceFirm || !req.body.construction) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    redis.set(0, '门户统计', req.body).then(() => {
        res.send({error: 0, msg: '添加成功'});
    }).catch((err) => {
        res.send({error: 1, msg: '系统错误', err});
    });
});

/*添加文档接口*/
router.post('/v1/portal/article', function(req, res) {
    (async ()=>{
        try {
            let article = req.body.obj;
            let obj = JSON.parse(article.content);
            let img = [], url = [], news = {};
            if(obj.attachments.length) {
                for(let att of obj.attachments) {
                    img.push(att.iconUrl);
                    url.push(att.url);
                }
            }
            if(article.type == 'super') {       // 纪检监察
                img = [], url = [];
                if(obj.attachmentforSRs.length) {
                    for(let att of obj.attachmentforSRs) {
                        img.push(att.iconUrl);
                        url.push(att.url);
                    }
                }
                news = {
                    title: obj.title,
                    time: obj.created,
                    img: img,
                    about: obj.brief || '',
                    publisher: obj.grassUser || '',
                    articleId: obj.id,
                    url: url,
                    tags: '通知公告',
                    content: obj.content,
                    source: obj.grassUserUnit
                }
            }
            if(article.type == 'news') {       // 新闻中心
                news = {
                    title: obj.title,
                    time: obj.created,
                    img: img,
                    about: obj.brief || '',
                    publisher: obj.creatorName || '',
                    articleId: obj.id,
                    url: url,
                    tags: '新闻中心',
                    content: obj.content,
                    source: obj.reportingOrg
                }
            }
            if(article.type == 'outgoing') {       // 集团发文
                news = {
                    title: obj.title,
                    time: obj.created,
                    img: img,
                    about: obj.brief || '',
                    publisher: obj.creatorName || '',
                    articleId: obj.id,
                    url: url,
                    tags: '集团发文',
                    content: obj.content,
                    source: obj.mainTo,
                    remark: obj.remark
                }
            }
            if(article.type == 'publish') {       // 综合事务
                news = {
                    title: obj.title,
                    time: obj.created,
                    img: img,
                    about: obj.brief || '',
                    publisher: obj.creatorName || '',
                    articleId: obj.id,
                    url: url,
                    tags: obj.columns,
                    content: obj.content,
                    source: obj.organName
                }
            }

            let id = await redis.set(0, "article", news);
            let tags = news.tags.split(",");
            for(let t of tags) {
                let obj = {title: news.title,time: news.time, img: news.img, about: news.about, publisher: news.publisher, articleId: id};
                await redis.zadd(1, t, obj);
                await redis.zadd(1, "标签", t);
            }
            res.send({error: 0, msg: "操作成功"});
        }catch (e) {
            res.send({error: 1, msg: e.toString()});
        }
    })();
});

/*添加新闻接口
router.post('/v1/portal/article', function(req, res) {
    console.log(req.body,"============================article")
    // if(!req.body.obj) {
    //     res.send({error: 1, msg: '参数不完整'});
    //     return;
    // }

    saveNews(req.body).then(function (result) {
        res.send(result);
    });
});*/

async function saveNews(news) {
    try {
        let id = await redis.set(0, "article", news);
        let tags = news.tags.split(",");
        for(let t of tags) {
            let obj = {title: news.title,time: news.time, img: news.img || [], about: news.about || '', publisher: news.publisher || '', articleId: id};
            await redis.zadd(0, t, obj);
            await redis.zadd(0, "标签", t);
        }
        return {error: 0, msg: "操作成功"};
    } catch (e) {
        console.error(e.toString(),"=======================error");
        return {error: 1, msg: e.toString()};
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
