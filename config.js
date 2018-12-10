/*
 * config
 */
const options = {
    RDS_PORT : '6379',                // 端口号
    RDS_HOST : '127.0.0.1',         // 服务器IP  要连接的A服务器redis
    // RDS_HOST : '172.16.3.21',           //服务器IP  要连接的A服务器redis
    RDS_PWD  : '',                    // 密码
    RDS_OPTS : {}                     // 设置项
};
const url = {
    host : 'http://59.110.172.228',
    // host : 'http://work.zgcgroup.vpn',
    IP : 'http://59.110.172.228',
    // IP : 'http://172.16.3.18',
    users : '/api/v1/users',                // 用户列表接口
    document : '/api/v1/share/list',        // 文档接口
    thumb : 'http://thumb1.zgcgroup.vpn:8012/onlinePreview?url=',     // 预览
};

// process.env.PORT = 3002;
process.env.PORT = 10013;

module.exports = {
	options:options,
    url:url
}
