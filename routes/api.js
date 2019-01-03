const express = require('express');
const moment = require("moment");
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
    redis.zrevrange("通知公告", [0, 4]).then(function (data) {
        for(let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        res.send({error: 0, msg: '获取成功', data});
    }).catch(function (e) {
        res.send({error: 1, msg: e.toString()});
    });
});

/* 集团门户文章修改 */
router.post('/v1/portal/article/upd', function (req, res) {
    if(!req.body.title) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    try {
        let id = req.body.id || moment().valueOf();
        redis.get("article:" + req.body.id).then((result)=>{
            let tags = req.body.tags;
            if(result) {
                let obj = JSON.parse(result);
                tags = obj.tags;
                redis.del(obj.tags + ":" + obj.title);
            }
            let art = {
                title: req.body.title,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                img: req.body.img || [],
                about: req.body.about || '',
                articleId: id
            };
            redis.zadd(tags + ":" + req.body.title, id, JSON.stringify(art));
            redis.zremrangebyscore(tags, [id, id]);
            redis.zadd(tags, id, JSON.stringify(art));
            art.id = id;
            art.url = req.body.url || '';
            art.tags = tags;
            art.content = req.body.content || '';
            redis.set('article:' + id, JSON.stringify(art));
            res.send({error: 0, msg: '修改成功'});
        });
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/* 删除文章 */
router.post('/v1/portal/article/del', function (req, res) {
    if(!req.body.id) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    try {
        redis.get("article:" + req.body.id).then((result)=>{
            if(result) {
                let obj = JSON.parse(result);
                redis.del(obj.tags + ":" + obj.title);
                redis.zremrangebyscore(obj.tags, [req.body.id, req.body.id]);
                redis.del('article:' + req.body.id);
                res.send({error: 0, msg: '删除成功'});
            }else{
                res.send({error: 1, msg: '没有找到相关信息'});
            }
        });
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/* 集团门户列表信息 */
router.get('/v1/portal/article', function (req, res) {
    let size = req.query.size || 20;
    let page = ((req.query.page || 1) - 1) * size;
    let pageSize = parseInt(page) + parseInt(size - 1);
    console.log(size,"===============================",pageSize);
    (async ()=>{
        try {
            let key = req.query.type;
            let arr = [];
            if(req.query.title) {
                key += ":" + req.query.title;
            }
            if(req.query.startTime && !req.query.endTime) {
                arr.push(moment(req.query.startTime).valueOf());
                arr.push(moment().valueOf());
            }
            if(!req.query.startTime && req.query.endTime) {
                arr.push(-1);
                arr.push(moment(req.query.endTime).valueOf());
            }
            if(req.query.startTime && req.query.endTime) {
                arr.push(moment(req.query.startTime).valueOf());
                arr.push(moment(req.query.endTime).valueOf());
            }
            if(!req.query.title && arr.length) {
                redis.zrangebyscore(key, arr).then(function (data) {
                    for(let i = 0; i < data.length; i++) {
                        data[i] = JSON.parse(data[i]);
                    }
                    res.send({error: 0, msg: '获取成功', data, page: 1, count: 1});
                });
            }else{
                let count = await redis.zcard(key);
                redis.zrevrange(key, [page, pageSize]).then(function (data) {
                    console.log(data,"================================");
                    for(let i = 0; i < data.length; i++) {
                        data[i] = JSON.parse(data[i]);
                    }
                    res.send({error: 0, msg: '获取成功', data, page: (req.query.page || 1), count: Math.ceil(count / size), totalNumber: count});
                }).catch(function (e) {
                    res.send({error: 1, msg: e.toString()});
                });
            }

        }catch (e) {
            res.send({error: 1, msg: e.toString()});
        }
    })();
});

/* 集团门户首页背景图片 */
router.post("/v1/portal/backdrop", function (req, res) {
    if(!req.body.url) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    try {
        redis.set('集团门户首页背景图片', JSON.stringify(req.body));
        res.send({error: 0, msg: '添加成功'});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/* 添加企业门户统计接口 */
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

/* 添加集团门户聚焦舆情接口 */
router.post('/v1/portal/focusing', function(req, res) {
    try {
        redis.zadd("聚焦舆情", moment().valueOf(), JSON.stringify(req.body));
        res.send({error: 0, msg: '添加成功'});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});


/*添加文档接口*/
router.post('/v1/portal/article/1', function(req, res) {
    try {
        let article = JSON.parse(req.body.obj);
        let obj = JSON.parse(article.body.content);
        let img = [], url = [], news = {};
        obj.id = moment().valueOf();
        if(obj.attachments && obj.attachments.length) {
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
        redis.exists("article:"+news.articleId).then((result)=>{
            if(!result) {
                redis.set("article:"+news.articleId, JSON.stringify(news));
                let tags = news.tags.split(",");
                for(let t of tags) {
                    let obj = {title: news.title,time: news.time, img: news.img, about: news.about, publisher: news.publisher, articleId: news.articleId};
                    redis.zadd(t + ":" + news.title, news.articleId, JSON.stringify(obj));
                    redis.zadd(t, news.articleId, JSON.stringify(obj));
                    redis.zadd("标签", news.articleId, t);
                }
            }
            res.send({error: 0, msg: "操作成功"});
        });
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
