/**
 * Created by 안재열 on 2017-06-20.
 * map.js 는 V-world GIS를 활용한 데이터 표출을 위해 사용되는 페이지 입니다.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('daumRoadView', { title: 'Express' });
    //res.render('map');
});



module.exports = router;
