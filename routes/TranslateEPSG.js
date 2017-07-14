/**
 * Created by 안재열 on 2017-06-20.
 * EPSG RESTful-API 활용을 위한 라우팅 모듈
 */

var trans = require('../Business/Translater/TranslaterDaumToVworld');


var TranslateEPSG = function (req, res, next) {
    var latitude = req.param("latitude");
    //var latitude = 37.5237774233;
    //var longitude = req.params.longitude;  //to-do 이건 나중에 블로깅
    var longitude = req.param("longitude");
    //var longitude = 126.92687777;
    result = trans("EPSG:4326","EPSG:5181", latitude, longitude);
    console.log(result);
    res.json(result);
};

module.exports = TranslateEPSG;

