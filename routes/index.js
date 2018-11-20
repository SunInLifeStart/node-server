const express = require('express');
const request = require("request");
const redis = require("../redis/redis");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    getLatestDocuments(2, 4, function (data) {
        (async () => {
            let leadershipSpeech = await redis.zrevrange(1, "领导讲话", [0, 4]);
            let writing = await redis.zrevrange(1, "集团发文", [0, 4]);
            let workBulletin = await redis.zrevrange(1, "工作简报", [0, 3]);
            let rules = await redis.zrevrange(1, "规章制度", [0, 4]);
            let noticeBulletin = await redis.zrevrange(1, "通知公告", [0, 4]);
            let meetingTable = await redis.zrevrange(1, "集团会表", [0, 1]);
            console.log(meetingTable,"==========");
            res.render('index', { docs: data.forms, leadershipSpeech, writing, workBulletin, rules, noticeBulletin, meetingTable});
        })()
    });
});

router.get('/latestDocuments', function(req, res) {
    getLatestDocuments(req.query.page, 24, function (data) {
        res.render('latestDocuments', { docs: data});
    })
});

router.get('/addressList', function(req, res) {
    res.render('addressList');
});

router.get('/meetingTable', function(req, res) {
    res.render('meetingTable');
});

router.get('/news', function(req, res) {
    res.render('news');
});

router.get('/details', function(req, res) {
    redis.get(1, "article:" + req.query.id).then(function (data) {
        res.render('details', {data: data, type: req.query.type});
    });
});

router.get('/leadershipSpeechs', function(req, res) {
    (async () => {
        let size = 10;
        let page = (req.query.page - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(1, '领导讲话');
        let leadershipSpeechs = await redis.zrevrange(1, "领导讲话", [page, pageSize]);
        res.render('leadershipSpeechs', {leadershipSpeechs, page: req.query.page, count: Math.ceil(count / size)});
    })()
});

router.get('/rulesRegulations', function(req, res) {
    (async () => {
        let size = 10;
        let page = (req.query.page - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(1, '规章制度');
        let rulesRegulations = await redis.zrevrange(1, "规章制度", [page, pageSize]);
        res.render('rulesRegulations', {rulesRegulations, page: req.query.page, count: Math.ceil(count / size)});
    })()
});

router.get('/writings', function(req, res) {
    (async () => {
        let size = 10;
        let page = (req.query.page - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(1, '集团发文');
        let writings = await redis.zrevrange(1, "集团发文", [page, pageSize]);
        res.render('writings', {writings, page: req.query.page, count: Math.ceil(count / size)});
    })()
});

router.get('/workBulletin', function(req, res) {
    (async () => {
        let size = 10;
        let page = (req.query.page - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(1, '工作简报');
        let workBulletin = await redis.zrevrange(1, "工作简报", [page, pageSize]);
        res.render('workBulletin', {workBulletin, page: req.query.page, count: Math.ceil(count / size)});
    })()
});

router.get('/noticeBulletin', function(req, res) {
    (async () => {
        let size = 10;
        let page = (req.query.page - 1) * size;
        let pageSize = page + size - 1;
        let count = await redis.zcard(1, '通知公告');
        let noticeBulletin = await redis.zrevrange(1, "通知公告", [page, pageSize]);
        res.render('noticeBulletin', {noticeBulletin, page: req.query.page, count: Math.ceil(count / size)});
    })()
});

function getLatestDocuments(page, pageSize, cb) {
    const options = {
        url: "http://59.110.172.228/api/v1/share/list",
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {
            "page":page,
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
