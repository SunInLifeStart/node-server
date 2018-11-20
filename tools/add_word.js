const xlsx = require("node-xlsx");
const mammoth = require("mammoth");
const async = require("async");
const redis = require('../redis/redis');
const fs = require("fs");

const options = {
    styleMap: [
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
    ],
    includeDefaultStyleMap :false
};

let url = 'E:/Table/excel/';

async function saveNews(news) {
    try {
        let id = await redis.set(1, "article", news);
        console.log(id,"=============================文章ID");
        let tags = news.tags.split(",");
        for(var i in tags) {
            let obj = {title: news.title,time: news.time, publisher: news.publisher, articleId: id};
            await redis.zadd(1, tags[i], obj);
            await redis.zadd(1, "标签", tags[i]);
        }
        return {error: 0, msg: "操作成功"};
    } catch (e) {
        console.error(e.toString(),"=======================/portal/saveNews");
        return {error: 1, msg: e.toString()};
    }
}

fs.readdir(url, function (err, files) {
    async.eachSeries(files, parse, function () {
        console.log('OK!!!');
    });
});

function parse(file, callback) {
    console.log(file,"---------------");
    let list = xlsx.parse(url+file);
    for(let obj of list) {
        if(obj.data.length) {
            for(let i = 1; i < obj.data.length; i++) {
                let arr = obj.data[i];
                // console.log(arr,"=============");
                console.log(arr[1],"---------------");
                if(arr[1]) {
                    let article = {title: arr[1], time: arr[7], publisher: arr[6], source: arr[4], tags: arr[8], url: '/files/'+arr[1]+'.pdf', content: ''};
                    saveNews(article).then(function (article) {
                        console.log(article,"=====================article");
                    },function (err) {
                        console.error(err,"=====================error");
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





