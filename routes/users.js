var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res, next) {
  req.session.user = 'yangjing';
  res.send({error: 0, msg: '登录成功'});
});

module.exports = router;
