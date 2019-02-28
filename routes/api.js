const express = require('express');
const moment = require("moment");
const config = require('../config');
const Redis = require('ioredis');
const Excel = require('exceljs');
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
    if(!req.body.title || !req.body.id) {
        res.send({error: 1, msg: '参数不完整'});
        return;
    }
    try {
       // let id = req.body.id || moment().valueOf();
        let id = req.body.id;
        redis.get("article:" + id).then((result)=>{
            let tags = req.body.tags;
            if(result) {
                let obj = JSON.parse(result);
                tags = obj.tags;
                redis.del(obj.tags + ":" + obj.title);

                let art = {
                    title: req.body.title,
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    img: req.body.img || [],
                    about: req.body.about || '',
                    articleId: id,
                    source: req.body.source,
                    publisher: req.body.publisher,
                    time:req.body.time
                };
                redis.set(tags + ":" + req.body.title,JSON.stringify(art));
                redis.zremrangebyscore(tags, [id, id]);
                redis.zadd(tags, id, JSON.stringify(art));
                art.id = id;
                art.url = req.body.url || '';
                art.tags = tags;
                art.content = req.body.content || '';
                if(req.body.text){
                    art.text = req.body.text;
                }
                redis.set('article:' + id, JSON.stringify(art),function(data){
                    res.send({error: 0, msg: '修改成功'});
                });
            }
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
    // if(!req.body.totalAssets || !req.body.fundedProjects || !req.body.serviceFirm || !req.body.construction) {
    //     res.send({error: 1, msg: '参数不完整'});
    //     return;
    // }
    try {
        redis.set('门户统计', JSON.stringify(req.body));
        res.send({error: 0, msg: '添加成功'});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});
router.get('/v1/portal/statistics', function(req, res) {
//    console.log(redis.get('门户统计', JSON.stringify(req.body)));
     redis.get('门户统计').then(function (data) {
         res.send({error: 0, msg: "success", data:JSON.parse(data)});
    });
});

// router.get('/v1/portal/focusing', function(req, res) {
//         //  redis.get('聚焦舆情').then(function (data) {
//         //      res.send({error: 0, msg: "success", data:JSON.parse(data)});
//         // });
//         res.send({error: 0, msg: "success"});
//        // zrevrange
        
// });

/* 添加集团门户聚焦舆情接口 */
router.post('/v1/portal/focusing', function(req, res) {
    try {
        redis.zadd("聚焦舆情", moment().valueOf(), JSON.stringify(req.body));
        res.send({error: 0, msg: '添加成功'});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

router.get('/v1/portal/focusing', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        // let count = await redis.zcard('聚焦舆情');
       // let focusing = await redis.zrevrange("聚焦舆情", [page, pageSize]);
       // let uc = await redis.get("usercount");
        // res.send({error: 1, msg:focusing});

        let count = await redis.zcard('聚焦舆情');
        redis.zrevrange('聚焦舆情', [page, pageSize]).then(function (data) {
            console.log(data);
            for(let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            res.send({error: 0, msg: '获取成功', data, page: (req.query.page || 1), count: Math.ceil(count / size), totalNumber: count});
        }).catch(function (e) {
            res.send({error: 1, msg: e.toString()});
        });
       // res.send('focusing', {focusing, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
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
                url.push(att);
            }
        }
        if(article.type == 'super') {       // 纪检监察
            img = [], url = [];
            if(obj.attachmentforSRs.length) {
                for(let att of obj.attachmentforSRs) {
                    img.push(att.iconUrl);
                    url.push(att);
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
            img = [], url = [];
            if(obj.attachments && obj.attachments.length) {
                for(let att of obj.attachments) {
                    if(att.attType == 'group')
                    {
                        img.push(att.iconUrl);
                    }                   
                }
            }
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
                text: obj.text || '',
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
                text: obj.text || '',
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
        req.body.id = moment(req.body.time).valueOf();
        redis.set("article:"+req.body.id , JSON.stringify(req.body));
        let tags = req.body.tags.split(",");
        for(let t of tags) {
            let obj = {title: req.body.title,time: req.body.time, img: req.body.img || [], about: req.body.about || '', publisher: req.body.publisher || '', articleId: req.body.id };
            redis.zadd(t, req.body.id , JSON.stringify(obj));
            redis.zadd("标签", req.body.id , t);
        }
        res.send({error: 0, msg: "操作成功"});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/**
 * app_upd  app版本管理编辑
 */
router.post('/v1/portal/app_upd/edit', function (req, res) {
    try {
        redis.set('app_upd', JSON.stringify(req.body));
        res.send({error: 0, msg: "操作成功"});
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/**
 * app版本管理信息
 */
router.get('/v1/portal/app_upd', function (req, res) {
    try {
        redis.get('app_upd').then(function (data) {
            res.send({error: 0, msg: "success", data:JSON.parse(data)});
        });
    }catch (e) {
        res.send({error: 1, msg: e.toString()});
    }
});

/**
 *   app用户组册
 */
router.post('/v1/portal/register', function (req, res) {
    res.send({error: 0, msg: "注册成功"});
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
/*中发展邮箱跳转*/
router.get('/v1/portal/zfzmail', function (req, res) {
    const request = require('request');
    if(process.env.NODE_ENV != 'production') { 
        res.send("当前环境不是正式环境");
    }else{
        const md5 = require('md5');    
        var userid = "";
        var key = "4Jy6iO";
        var loginPlatform = "windows";
        var type = "READMAIL";
        var partnerid = "100053";
        var authcorpid = "zgcgroup.com.cn";
        var timestamp = new Date().getTime() + '';
        if (req.cookies.token) {
            request(config.url.IP + '/api/admin/user/userInfo1?token='+req.cookies.token, function (error, response, body) {
                userid = JSON.parse(body).username+"@"+authcorpid;
                var sign = md5(key + loginPlatform + type + partnerid + authcorpid + userid + timestamp);
                var url = "http://weixin.263.net/partner/web/third/mail/loginMail.do"
                    + "?loginPlatform=" + loginPlatform
                    + "&type=" + type
                    + "&partnerid=" + partnerid
                    + "&authcorpid=" + authcorpid
                    + "&userid=" + userid
                    + "&timestamp=" + timestamp
                    + "&sign=" + sign;
      
                res.redirect(url)
            });
        } else {
            res.send({ error: 1, msg: "跳转失败" });
        }
    }

  });
router.get('/v1/portal/deploy', function (req, res) {
    var process = require('child_process');
    process.exec('/Users/seebox/workapp/deploy.sh',function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        res.send(stderr);
    });
    
});
router.get('/v1/portal/uc', function (req, res) {
    (async () => {
        let uc = await redis.get("usercount");
        res.send(uc);
    })()
});
router.post('/v1/portal/huibiao', function (req, res) {
    (async () => {
        const workbook = new Excel.Workbook(); // 创建一个文件
        workbook.creator = 'test';
        workbook.lastModifiedBy = 'test';
        workbook.created = new Date();
        workbook.modified = new Date();
    
        const sheet = workbook.addWorksheet('集团会表'); // 创建一个工作组
        // 创建列
        sheet.columns = [
          { header: '日期/星期', key: 'startTime', width: 20 },
          { header: '上/午', key: 'timeJuder', width: 15 },
          { header: '时间', key: 'shortTime', width: 15 },
          { header: '内容', key: 'meetingName', width: 55 },
          { header: '地点', key: 'meetingRoom', width: 15 },
          { header: '参会人员', key: 'attendees', width: 55 },
          { header: '召集部门', key: 'hostDepartmentCode', width: 15 },
        ];
        sheet.addRows(req.body);// 创建行
        const filename = '集团会表.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', "attachment;filename*=UTF-8' '" + encodeURIComponent(filename));
        res.send(await workbook.xlsx.writeBuffer());
    })()
});
module.exports = router;
