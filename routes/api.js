const express = require('express');
// const moment = require("moment");
const config = require('../config');
const Redis = require('ioredis');
const redis = new Redis(config.options.RDS_PORT, config.options.RDS_HOST);
// const FileUploadUtil = require('../tools/FileUploadUtil');
const router = express.Router();

/* 通知公告详情 */
router.get('/v1/portal/details', function (req, res) {
    redis.get("article:" + req.query.id).then((result)=>{
        res.send({error: 0, msg: '获取成功', data: JSON.parse(result)});
    }).catch((e)=>{
        res.send({error: 1, msg: e.toString()});
    });
});

/* 通知公告列表 */
router.get('/v1/portal/noticeBulletin', function (req, res) {
    redis.zrevrange("通知公告", [0, 4, 'withscores']).then(function (data) {
        for(let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        res.send({error: 0, msg: '获取成功', data});
    }).catch(function (e) {
        res.send({error: 1, msg: e.toString()});
    });
});

/*添加企业门户统计接口*/
router.post('/v1/portal/statistics', function(req, res) {
    if(!req.body.totalAssets || !req.body.fundedProjects || !req.body.serviceFirm || !req.body.construction) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    try {
        redis.set('门户统计', JSON.stringify(req.body));
        res.send({error: 0, msg: '添加成功'});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/*添加文档接口*/
router.post('/v1/portal/article/1', function(req, res) {
    try {
        let obj = JSON.parse(req.body.body.content);
        let img = [], url = [], news = {};
        if(obj.attachments && obj.attachments.length) {
            for(let att of obj.attachments) {
                img.push(att.iconUrl);
                url.push(att.url);
            }
        }
        if(req.body.type == 'super') {       // 纪检监察
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
        if(req.body.type == 'news') {       // 新闻中心
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
        if(req.body.type == 'outgoing') {       // 集团发文
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
        if(req.body.type == 'publish') {       // 综合事务
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
        redis.set("article:"+news.articleId, JSON.stringify(news));
        let tags = news.tags.split(",");
        for(let t of tags) {
            let obj = {title: news.title,time: news.time, img: news.img, about: news.about, publisher: news.publisher, articleId: news.articleId};
            redis.zadd(t, news.articleId, JSON.stringify(obj));
            redis.zadd("标签", news.articleId, t);
        }
        res.send({error: 0, msg: "操作成功"});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/*添加新闻接口*/
router.post('/v1/portal/article', function(req, res) {
    try {
        redis.set("article:"+req.body.id, JSON.stringify(req.body));
        let tags = req.body.tags.split(",");
        for(let t of tags) {
            let obj = {title: req.body.title,time: req.body.time, img: req.body.img || [], about: req.body.about || '', publisher: req.body.publisher || '', articleId: req.body.id};
            redis.zadd(t, req.body.id, JSON.stringify(obj));
            redis.zadd("标签", req.body.id, t);
        }
        res.send({error: 0, msg: "操作成功"});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});


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
