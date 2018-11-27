let express = require('express');
const redis = require("../redis/redis");
let router = express.Router();

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
            let obj = {title: news.title,time: news.time, img: news.img || '', about: news.about || '', publisher: news.publisher, articleId: id};
            if(tags[i].indexOf('党') > -1) {
                tags[i] = 'partyBuilding';
            }
            await redis.zadd(1, tags[i], obj);
            await redis.zadd(1, "标签", tags[i]);
        }
        return "添加成功";
    } catch (e) {
        console.error(e.toString(),"=======================error");
        return e.toString();
    }
}

module.exports = router;
