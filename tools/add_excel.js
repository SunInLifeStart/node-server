const xlsx = require("node-xlsx");
const mammoth = require("mammoth");
const async = require("async");
const redis = require('../redis/redis');
const fs = require("fs");

async function saveNews(news) {
    try {
        var result = await redis.save(1, "文章", news);
        let tags = news.tags.split(",");
        for(var i in tags) {
            let obj = {title: news.title,time: news.time, publisher: news.publisher};
            result = await redis.save(1, tags[i], obj);
            result = await redis.save(1, "标签", tags[i]);
        }
        return {error: 0, msg: "操作成功"};
    } catch (e) {
        console.error(e.toString(),"=======================/portal/saveNews");
        return {error: 1, msg: e.toString()};
    }
}

let list = xlsx.parse('E:/Table/中关村发展集团总部新电话表-1109.xlsx');
let bu = "";
for(let obj of list) {
    if(obj.data.length) {
        for(let i = 3; i < obj.data.length; i++) {
            let arr = obj.data[i];
            // console.log(arr,"=============");
            if(arr[0]){
                bu = arr[0];
            }else{
                arr[0] = bu;
            }
            console.log(arr[0],"---------------0");
            if(arr[1]) {
                console.log(arr[1],"---------------1");
            }
        }
    }
}






