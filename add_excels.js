const xlsx = require("node-xlsx");
const mammoth = require("mammoth");
const async = require("async");
const moment = require("moment");
const path = require('path');
const config = require('./config');
const Redis = require('ioredis');
const redis = new Redis(config.options.RDS_PORT, config.options.RDS_HOST);

const fs = require("fs");

const options = {
    styleMap: [
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
    ],
    includeDefaultStyleMap :false
};


async function saveNews(news) {
    try {
        redis.set("article:"+news.id, JSON.stringify(news));
        let tags = news.tags.split(",");
        for(let i of tags) {
            let obj = {title: news.title,time: news.time, img: news.img, about: news.about, publisher: news.publisher, articleId: news.id};
            await redis.zadd(i + ":" + news.title, news.id, JSON.stringify(obj));
            await redis.zadd(i, news.id, JSON.stringify(obj));
            await redis.zadd("标签", news.id, i);
        }
        return "添加成功";
    } catch (e) {
        console.error(e.toString(),"=======================error");
        return e.toString();
    }
}

let url = path.join(__dirname, 'public/files/Table/excel/');

fs.readdir(url, function (err, files) {
    async.eachSeries(files, parse, function () {
        console.log('-------------------------------------------');
    });
});

function parse(file, callback) {
    let list = xlsx.parse(url+file);
    for(let obj of list) {
        if(obj.data.length) {
            for(let i = 1; i < obj.data.length; i++) {
                let arr = obj.data[i];
                if(arr[1]) {
                    redis.incr('articleID').then((id)=>{
                        id = (moment().valueOf() + id * 1000);
                        let article = {id: id, title: arr[1], time: arr[7], publisher: arr[6], source: arr[4], tags: arr[8], url: ['/files/'+arr[1]+'.pdf'], content: arr[9], img: arr[27]?[arr[27]]:[], about: arr[28]};
                        if(arr[8] == "新闻中心" || arr[8] == "partyBuilding" || arr[8] == "工会活动")
                            article.url = '';
                        saveNews(article).then(function (article) {
                            console.log("---------------"+article+"--------------");
                        },function (err) {
                            console.error(err,"=====================error");
                        });
                    });

                    // mammoth.convertToHtml({path: "E:/Table/"+arr[1]+".docx"}, options)
                    //     .then(function(result){
                    //         let html = result.value;
                    //         // let messages = result.messages; // Any messages, such as warnings during conversion
                    //         let article = {title: arr[1], time: arr[7], publisher: arr[6], source: arr[4], tags: arr[8], url: 'http://localhost:3002/files/'+arr[1]+'.pdf', content: ''};
                    //         saveNews(article).then(function (article) {
                    //             console.log(article,"=====================article");
                    //         },function (err) {
                    //             console.error(err,"=====================error");
                    //         });
                    //         // console.log(article);
                    //     }).done();
                }
            }
        }
    }
    callback(null);
}

//
// mammoth.extractRawText({path: "E:/Table/aaa.docx"})
//     .then(function(result){
//         var text = result.value; // The raw text
//         console.log(result,"====================");
//         var messages = result.messages;
//         console.log(result);
//     }).done();





