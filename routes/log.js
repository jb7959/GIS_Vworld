/**
 * Created by 안재열 on 2017-06-20.
 * map.js 는 V-world GIS를 활용한 데이터 표출을 위해 사용되는 페이지 입니다.
 */

var express = require('express');
var router = express.Router();
/* GET home page. */

//LogFile전송 app.get('/download/:id',
router.get('/', function(req, res, next) {
    res.set('Content-Type','multipart/form-data');
    res.download('./LogFile/0628_sample.txt'); //기본 logfile
    console.log("Success of Reading file!");
});
module.exports = router;
