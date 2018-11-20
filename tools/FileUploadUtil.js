/**
 * Created by admin on 2016/7/25.
 * 文件上传
 */
var formidable = require('formidable');
var fs = require('fs');
var moment = require("moment");
var mkdirp = require("mkdirp");

var config = require("../tools/tsconfig");

/**
 * 上传图片
 *
 * @param uploadDir 保存路径
 */
var fileUploadUtil = {
    imagetempDir: config.workingPath + "/public/images/temp"
};
// 支持多张图片同时上传, 要求input标签 name一样, 支持html5多文件上传
fileUploadUtil.uploadImage = function (req, uploadDir, callback) {
    if (!fs.existsSync(this.imagetempDir)){
        fs.mkdirSync(this.imagetempDir);
    }
    var form = new formidable.IncomingForm({uploadDir: this.imagetempDir, keepExtensions: false, multiples: true});
    form.parse(req, function (err, fields, files) {// 上传
        var images = [];// 上传的文件路径
        if (files.files){
            if (files.files.length) {
                for (var i = 0, l = files.files.length; i < l; i++) {
                    saveUploadFile(files.files[i], uploadDir, images);
                }
            } else {// 上传完成,然后处理
                saveUploadFile(files.files, uploadDir, images);
            }
        }
        callback(err, fields, images);
    });
}
// 多个input,且名称不一样, 支持html5上传
fileUploadUtil.uploadImage_MultiInput = function (req, uploadDir, callback) {
    if (!fs.existsSync(this.imagetempDir)){
        fs.mkdirSync(this.imagetempDir);
    }
    var form = new formidable.IncomingForm({uploadDir: this.imagetempDir, keepExtensions: false, multiples: true});
    form.parse(req, function (err, fields, files) {// 上传
        console.log(JSON.stringify(files));
        var multifile = {};
        var images = [];// 上传的文件路径
        var codeimages = [];// 二维码
        var seximages = [];// 性别分布图
        if (files.files.length) {
            for (var i = 0, l = files.files.length; i < l; i++) {
                saveUploadFile(files.files[i], uploadDir, images);
            }
        } else {// 上传完成,然后处理
            saveUploadFile(files.files, uploadDir, images);
        }
        // 二维码
        if (files.code.length) {
            for (var i = 0, l = files.code.length; i < l; i++) {
                saveUploadFile(files.code[i], uploadDir, codeimages);
            }
        } else {// 上传完成,然后处理
            saveUploadFile(files.code, uploadDir, codeimages);
        }
        //
        if (files.sex.length) {
            for (var i = 0, l = files.sex.length; i < l; i++) {
                saveUploadFile(files.sex[i], uploadDir, seximages);
            }
        } else {// 上传完成,然后处理
            saveUploadFile(files.sex, uploadDir, seximages);
        }
        callback(err, fields, {images: images, codeimages: codeimages, seximages: seximages});
    });
}

/**
 * 微信朋友圈图片上传
 *
 * @param req
 * @param uploadDir
 * @param callback
 */
fileUploadUtil.wechatCircleUpload = function (req, uploadDir, callback) {
    if (!fs.existsSync(this.imagetempDir)) {
        mkdirp.sync(this.imagetempDir);
    }
    var form = new formidable.IncomingForm({uploadDir: this.imagetempDir, keepExtensions: false, multiples: true});
    form.parse(req, function (err, fields, files) {// 上传
        var images = [];
        if (files.images != undefined) {
            if (files.images.length) {
                for (var i = 0, l = files.images.length; i < l; i++) {
                    images.push(saveUploadImage(files.images[i], uploadDir));
                }
            } else {// 上传完成,然后处理
                var url = saveUploadImage(files.images, uploadDir);
                if (url) {
                    images.push(url);
                }
            }
        }
        callback(err, fields, images);
    });
}

fileUploadUtil.wechatPublicUpload = function (req, uploadDir, callback) {
    if (!fs.existsSync(this.imagetempDir)){
        fs.mkdirSync(this.imagetempDir);
    }
    var form = new formidable.IncomingForm({uploadDir: this.imagetempDir, keepExtensions: false, multiples: true});
    form.parse(req, function (err, fields, files) {// 上传
        var headimages = [];// 头像
        if (files.headimage){
            var file = files.headimage.length ? files.headimage[0] : files.headimage;
            saveUploadFile(file, uploadDir, headimages);
        }
        var screenshots = [];// 好友数量截图
        if (files.followscreenshot != undefined){
            var file = files.followscreenshot.length ? files.followscreenshot[0] : files.followscreenshot;
            saveUploadFile(files, uploadDir, screenshots);
        }
        var codeimage = [];// 二维码
        if (files.code){
            var file = files.code.length ? files.code[0] : files.code;
            saveUploadFile(file, uploadDir, codeimage);
        }
        var sexdist = [];// 性别分布截图
        if (files.sexdist){
            var file = files.sexdist.length ? files.sexdist[0] : files.sexdist;
            saveUploadFile(file, uploadDir, sexdist);
        }
        callback(err, fields, {headimages: headimages, screenshots: screenshots, codeimage: codeimage, sexdist: sexdist});
    });
}

/**
 * 保存图片
 *
 * @param file
 * @param saveDir
 * @param images
 */
function saveUploadFile(file, saveDir, images) {
    console.log(file.name + "-----" + file.path + "=" + JSON.stringify(file));
    if (!file.name || !file.size){
        return;
    }
    var filename = file.name;// 获取文件名
    var stuffix = filename.substr(filename.lastIndexOf("."), filename.length);// 文件后缀名,带 '.'
    if (stuffix != ".jpg" && stuffix != ".png" && stuffix != ".jpeg" && stuffix != ".gif" && stuffix != ".xls") {
        console.log("----------图片上传,不允许后缀名---------stuffix=" + stuffix);
        fs.unlinkSync(file.path);// 删除
    } else {
        if(stuffix == '.xls' || stuffix == '.xlsx'){
            saveDir = "/excels/";
        }else{
            saveDir = "/images/" + saveDir;
        }
        var savePath = config.workingPath + '/public' + saveDir;
        if (!fs.existsSync(savePath)){
            fs.mkdirSync(savePath);
        }
        var newName = moment().format("YYYYMMDDHHmmss") + parseInt(Math.random()*100000) + stuffix;
        fs.renameSync(file.path, savePath + newName);// 移动和重命名
        images.push(config.basePath + saveDir + newName);
    }
}


/**
 * 保存图片
 * @param file 文件
 * @param saveDir 保存文件夹
 */
function saveUploadImage(file, saveDir) {
    console.log(file.name + "-----" + file.path + "=" + JSON.stringify(file));
    if (!file.name || !file.size) {
        return "";
    }
    var filename = file.name;// 获取文件名
    var stuffix = filename.substr(filename.lastIndexOf("."), filename.length);// 文件后缀名,带 '.'
    if (stuffix != ".jpg" && stuffix != ".png" && stuffix != ".jpeg" && stuffix != ".gif") {
        console.log("----------图片上传,不允许后缀名---------stuffix=" + stuffix);
        fs.unlinkSync(file.path);// 删除
    } else {
        var savePath = config.workingPath + "/public/images/" + saveDir;
        if (!fs.existsSync(savePath)) {
            mkdirp.sync(savePath);// 创建目录
        }
        console.log(savePath,"===============================");
        var newName = (moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 100000) + stuffix);
        fs.renameSync(file.path, savePath + newName);// 移动和重命名
        return config.basePath + "/images/" + saveDir + newName;
    }
}

module.exports = fileUploadUtil;