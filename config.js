/*
 * config
 */
let options = {
    RDS_PORT : '6379',                // 端口号
    RDS_HOST : '127.0.0.1',         // 服务器IP  要连接的A服务器redis
    // RDS_HOST : '172.16.3.21',           //服务器IP  要连接的A服务器redis
    RDS_PWD  : '',                    // 密码
    RDS_OPTS : {},                    // 设置项
    IM_APPKEY : '17ebed675b60615c1c448004',
    IM_SECRET : '2ffac682b34c94e4c5ed4bf4'
};
let url = {
    host : 'http://59.110.172.228',
    // host : 'http://work.zgcgroup.vpn',
    IP : 'http://59.110.172.228',
    // IP : 'http://172.16.3.18',
    users : '/api/v1/users',                // 用户列表接口
    document : '/api/v1/share/list',        // 文档接口
    thumb : 'http://thumb1.zgcgroup.vpn:8012/onlinePreview?url=',     // 预览
};
process.env.PORT = 10013;

console.log(process.env.NODE_ENV,"================================NODE_ENV");

if(process.env.NODE_ENV == 'production') {  // vpn环境
    process.env.PORT = 3002;
    options.RDS_HOST = '172.16.3.21';
    options.IM_APPKEY = 'f115b2f223b374d8769e7c07';
    options.IM_SECRET = '7483c4c369f1863574aeb7c8';
    url.host = 'http://work.zgcgroup.vpn';
    url.IP = 'http://172.16.3.18';
}

module.exports = {
	options:options,
    url:url
}
