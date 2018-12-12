// redis 链接
const config = require('../config');
const Redis = require('ioredis');
const redis = new Redis(config.options.RDS_PORT, config.options.RDS_HOST);
// const moment = require("moment");

/**
 * 添加有序集合
 * @param db
 * @param key
 * @param val
 * @returns {Promise<any>}
 */
exports.zadd = function( key, val) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.incr("score", function (err, score) {
                    client.zadd(key, score, JSON.stringify(val), function (err, res) {
                        resolve(res);
                        reject(err);
                    });
                });
            }
        });
    })
};

/**
 * 添加字符串
 * @param db
 * @param key
 * @param val
 * @returns {Promise<any>}
 */
exports.set = function( key, val) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.incr("score", function (err, score) {
                    if(key === 'article') {
                        val.id = score;
                        key += ":" + score
                    }
                    client.set(key, JSON.stringify(val), function (err, res) {
                        resolve(score);
                        reject(err);
                    });
                });
            }
        });
    })
};

/**
 * 数量累计
 * @param db
 * @param key
 * @param val
 */
exports.incrby = function( key, val) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.incrby(key, val, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    })
};

/**
 * 自增
 * @param db
 * @param key
 * @param callback
 */
exports.incr = function( key) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.incr(key, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });

};
/**
 * 添加list数据
 * @param db
 * @param key
 * @param obj
 */
exports.lpush = function( key, obj) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.lpush(key, JSON.stringify(obj), function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};

/**
 * 有序集合列表（asc）
 * @param db
 * @param key
 * @param option
 * @param callback
 */
exports.zrange = function( key, option) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.zrange(key, option, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};
/**
 * 有序集合列表(desc)
 * @param db
 * @param key
 * @param option
 */
exports.zrevrange = function( key, option) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.zrevrange(key, option, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};
/**
 * 获取集合个数
 * @param db
 * @param key
 */
exports.zcard = function( key) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.zcard(key, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    })
};

/**
 * 获取List数据
 * @param db
 * @param key
 * @param option
 * @returns {Promise<any>}
 */
exports.lrange = function( key, option) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.lrange(key, option, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};

/**
 * 获取字符串数据
 * @param db
 * @param key
 * @returns {Promise<any>}
 */
exports.get = function( key) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.get(key, function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};

/**
 * 删除一个库所有key
 * @param db
 * @returns {Promise<any>}
 */
exports.flushdb = function(db) {
    return new Promise(function (resolve, reject) {
        client.select( function(err) {
            if (err) {
                reject(err);
            } else {
                client.flushdb(function (err, res) {
                    resolve(res);
                    reject(err);
                });
            }
        });
    });
};

