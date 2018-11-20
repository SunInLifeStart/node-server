// redis 链接
var redis = require('redis');
const config = require('../config');
var client = redis.createClient(config.options.RDS_PORT, config.options.RDS_HOST);
// client.auth("123456");

client.on('end',function(err){
    console.log('end');
});

// redis 链接错误
client.on("err", function(err) {
    console.log(err);
});

/**
 * 有序集合添加 Set
 * @param db
 * @param key
 * @param val
 * @param callback

exports.save = function(db, key, id, val, callback) {
    client.select(db, function(err) {
        if (err) {
            callback(err);
        } else {
            if(id) {
                client.zadd(key, id, JSON.stringify(val), callback);
            }else{   // 添加自增集合set
                client.zrange(key, 0, -1, "WITHSCORES", function (err, data) {
                    console.log(data,"=======================",val);
                    if (JSON.stringify(data).indexOf(val) < 0) {
                        client.incr("score", function (err, score) {
                            val.id = score;
                            client.zadd(key, score, JSON.stringify(val), callback);
                        });
                    }else{
                        callback("数据已存在");
                    }
                });
            }
        }
    });
};*/

exports.zadd = function(db, key, val) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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

exports.set = function(db, key, val) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.incrby = function(db, key, val) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.incr = function(db, key) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.lpush = function(db, key, obj) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
 * 有序集合列表
 * @param db
 * @param key
 * @param option
 * @param callback
 */
exports.zrange = function(db, key, option) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
 * 有序集合列表(排序)
 * @param db
 * @param key
 * @param option
 */
exports.zrevrange = function(db, key, option) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.zcard = function(db, key) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.lrange = function(db, key, option) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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
exports.get = function(db, key) {
    return new Promise(function (resolve, reject) {
        client.select(db, function(err) {
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



