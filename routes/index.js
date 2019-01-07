const express = require('express');
const request = require("request");
// const moment = require("moment");
const config = require('../config');
const Redis = require('ioredis');
const redis = new Redis(config.options.RDS_PORT, config.options.RDS_HOST);
const router = express.Router();

const personalPortal = config.url.host;  // 外网地址

router.get('/', function(req, res) {
    res.redirect("/index");
});

/* GET home page. */
router.get('/index', function(req, res) {
    getLatestDocuments(1, 4, function (data) {
        (async () => {
            let leadershipSpeech = await redis.zrevrange("领导讲话", [0, 4]);
            let writing = await redis.zrevrange("集团发文", [0, 4]);
            let workBulletin = await redis.zrevrange("工作简报", [0, 4]);
            let rules = await redis.zrevrange("规章制度", [0, 10]);
            let noticeBulletin = await redis.zrevrange("通知公告", [0, 4]);
            let meetingTable = await redis.zrevrange("集团会表", [0, 10]);
            let comm = await redis.zrevrange("通讯录", [0, 7]);
            let news = await redis.zrevrange("新闻中心", [0, 2]);
            let focusing = await redis.zrevrange("聚焦舆情", [0, 13]);
            let uc = await redis.get("usercount");
            let statistics = await redis.get("门户统计");
            let backdrop = await redis.get("集团门户首页背景图片");
            if(backdrop) {
                backdrop = JSON.parse(backdrop);
                backdrop.url = personalPortal + backdrop.url;
            }
            meetingTable.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            noticeBulletin.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            workBulletin.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            writing.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            leadershipSpeech.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            rules.sort(function (a, b) {
                return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
            });
            console.log(req.session.user,"=====================statistics");
            res.render('index', { docs: data.forms || [], news, uc, statistics, focusing, backdrop: backdrop || {}, leadershipSpeech, writing, workBulletin, rules, noticeBulletin, meetingTable: [meetingTable ? meetingTable[0]: {}], personalPortal: personalPortal, menuClass: 1, comm, thumb: config.url.thumb});
        })()
    });
});

router.get('/latestDocuments', function(req, res) {
    getLatestDocuments(req.query.page, 24, function (data) {
        res.render('latestDocuments', { docs: data, personalPortal: personalPortal});
    })
});

router.get('/partyBuilding', function(req, res) {
    (async () => {
        let partyBuilding = await redis.zrevrange("partyBuilding", [0, 2]);
        let tradeUnion = await redis.zrevrange("工会活动", [0, 2]);
        let uc = await redis.get("usercount");
        res.render('partyBuilding', {tradeUnion, uc, partyBuilding, personalPortal: personalPortal});
    })()
});

router.get('/:news/list', function(req, res) {
    (async () => {
        let key = '', title = '';
        if(req.params.news == 'news') {
            key = '新闻中心';
        }
        if(req.params.news == 'partyBuildingAll') {   // 集团党建
            key = 'partyBuilding';
        }
        if(req.params.news == 'tradeUnion') {
            key = '工会活动';
        }
        let size = 9;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(key);
        let news = await redis.zrevrange(key, [page, pageSize]);
        if(key == 'partyBuilding') {
            key = '集团党建';
        }
        news.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('news', {news, uc, page: (req.query.page || 1), count: Math.ceil(count / size), dataTotal: count || 0, key: req.params.news, title: key, menuClass: 2, personalPortal: personalPortal});
    })()
});

router.get('/:classify/details', function(req, res) {
    redis.get("article:" + req.query.id).then(function (data) {
        (async () => {
            let uc = await redis.get("usercount");
            if(req.params.classify == 'news') {
                req.params.classify = "news/list";
            }
            res.render('details', {data: data, uc, type: req.query.type, classify: req.params.classify, personalPortal: personalPortal});
        })();
    });
});

router.get('/leadershipSpeechs', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('领导讲话');
        let leadershipSpeechs = await redis.zrevrange("领导讲话", [page, pageSize]);
        leadershipSpeechs.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('leadershipSpeechs', {leadershipSpeechs, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/newsList', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('新闻中心');
        let newsList = await redis.zrevrange("新闻中心", [page, pageSize]);
        newsList.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('newsList', {newsList, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/rulesRegulations', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('规章制度');
        let rulesRegulations = await redis.zrevrange("规章制度", [page, pageSize]);
        rulesRegulations.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('rulesRegulations', {rulesRegulations, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/writings', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('集团发文');
        let writings = await redis.zrevrange("集团发文", [page, pageSize]);
        writings.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('writings', {writings, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/workBulletin', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('工作简报');
        let workBulletin = await redis.zrevrange("工作简报", [page, pageSize]);
        workBulletin.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('workBulletin', {workBulletin, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/contactWay', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('通讯录');
        let contactWay = await redis.zrevrange("通讯录", [page, pageSize]);
        contactWay.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('contactWay', {contactWay, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/focusing', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('聚焦舆情');
        let focusing = await redis.zrevrange("聚焦舆情", [page, pageSize]);
        let uc = await redis.get("usercount");
        res.render('focusing', {focusing, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/groupTable', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('集团会表');
        let groupTable = await redis.zrevrange("集团会表", [page, pageSize]);
        groupTable.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('groupTable', {groupTable, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

router.get('/noticeBulletin', function(req, res) {
    (async () => {
        let size = 10;
        let page = ((req.query.page || 1) - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard('通知公告');
        let noticeBulletin = await redis.zrevrange("通知公告", [page, pageSize]);
        noticeBulletin.sort(function (a, b) {
            return (new Date(JSON.parse(b).time) - new Date(JSON.parse(a).time));
        });
        let uc = await redis.get("usercount");
        res.render('noticeBulletin', {noticeBulletin, uc, page: req.query.page, count: Math.ceil(count / size), dataTotal: count || 0, personalPortal: personalPortal});
    })()
});

function getLatestDocuments(page, pageSize, cb) {
    const options = {
        url: config.url.IP + config.url.document,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {
            "page":page || 1,
            "pageSize": pageSize,
            "desc": true,
            "orderBy": "id",
            "options": [
                {
                    "field":"id",
                    "filter": "NOTNULL"
                }
            ]
        }
    };
    request(options, function(error, response, body) {
        cb(body);
    });
}

module.exports = router;
