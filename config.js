/*
 * config
 */
const options = {
    RDS_PORT : '6379',                // 端口号
    RDS_HOST : '127.0.0.1',           // 服务器IP  要连接的A服务器redis
    RDS_PWD  : '',                    // 密码
    RDS_OPTS : {}                     // 设置项
};
const url = {
    host : 'http://59.110.172.228',
    users : '/api/v1/users',// 用户列表接口
    document : '/api/v1/share/list'
};

module.exports = {
	options:options,
    url:url
}
