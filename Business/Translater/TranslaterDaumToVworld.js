/**
 * Created by 안재열 on 2017-06-27.
 * 좌표계 변환 모듈
 * WGS84(EPSG 4326)에서 Korea2000(EPSG 5181)으로 변경하기 위한 모듈 파일
 *proj 사용 https://www.npmjs.com/package/proj4
 */

var proj4 = require("proj4")
proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
proj4.defs('EPSG:5181', "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");

//var WGS84 =["wgs84","wgs-84","epsg:4326","epsg-4326"];

var EPSG4326 = proj4('WGS84');
var EPSG5181 = proj4('EPSG:5181');

function translate(from, to, latitude, longitude) {

    var result = [];

    if ((from == "EPSG:4326") && (to == "EPSG:5181")) {
        console.log("@@@@");
        //var re = proj4(WGS84,EPSG5181).forward([124.84886357164862, 33.47611947955653]);
        var re = proj4(EPSG4326, EPSG5181).forward([longitude, latitude]); //사용결과
        result = [re[0], re[1]];
    }

    if ((from == "EPSG:5181") && (to == "EPSG:4326")) {
        var re = proj4(EPSG5181, EPSG4326).forward([longitude, latitude]); // 같음 proj4(EPSG4326,EPSG5181).inverse([longitude, latitude]);
        result = [re[1], re[0]];
    }
    return result;
}


module.exports = translate;