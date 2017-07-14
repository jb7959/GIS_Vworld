/**
 * Created by 안재열 on 2017-06-26.
 */

var vmap;
var selectMarker;
var bar, bar1;
var pos, pos1;
var routeMap1 = null;

vw.ol3.MapOptions = {
    basemapType: vw.ol3.BasemapType.GRAPHIC
    , controlDensity: vw.ol3.DensityType.FULL
    , interactionDensity: vw.ol3.DensityType.BASIC
    , controlsAutoArrange: true
    , homePosition: vw.ol3.CameraPosition
    , initPosition: vw.ol3.CameraPosition
};

vmap = new vw.ol3.Map("vmap", vw.ol3.MapOptions); //HTML의 id 'vmap' 추가 및 맵 옵션 추가
vmap.getView().setCenter([14129709.590359, 4512313.7639686]);
vmap.getView().setZoom(15);

/*GIS DATA log 호출*/
$.ajax({
    url: "./log",
    success: function (result) {
        addTextLayer(result, 'EPSG:4326');
    }
});

vmap.on('pointermove', function (evt) {
    var feature = vmap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        if (layer != null && layer.className == 'vw.ol3.layer.Marker') {
            $('#param').val('');
            $('#param').val(feature.get('id'));
            selectMarker = feature;
        } else {
            return false;
        }
    });
});

function isMobile() {
    try {
        var browserCheckText = ['iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson'];
        for (var word in browserCheckText) {
            if (navigator.userAgent.toUpperCase().match(browserCheckText[word].toUpperCase()) != null) {
                return true;
                break;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

/*if(!isMobile()){
 $('#buttons').append("<input type='file' id='file1' onchange='addTextLayer(this)' /> epsg"+
 "		<select name='epsg' id='epsg'>"+
 "			<option value='EPSG:4326'>EPSG:4326</option>"+
 "			<option value='EPSG:900913'>EPSG:900913</option>"+
 "		</select>  &nbsp    &nbsp <a href='/ol3_map/data.zip'>data.zip 다운로드</a>");
 }*/

function setMode(basemapType) {
    vmap.setBasemapType(basemapType);
};

function removeAllObject() {
    vmap.clear();
};

function checkEventExists() {
    if ($('#param').val() == '') {
        alert('이벤트명을 입력하세요\n\n사용가능한 이벤트 목록\n\nmoveend  , pointermove,  postrender  , propertychange');
        $('#param').val('moveend');
        $('#param').focus();
        return;
    }
    var result = vmap.isEventExists($('#param').val(), vmap.eventTargetListeners_);
    if (result) {
        alert(result);
    } else {
        alert(result);
        alert('현재 등록된 이벤트는 moveend  , pointermove,  postrender  , propertychange 입니다.');
    }
    $('#param').val('');
};

function setVisible(chk) {
    if (chk) {
        vmap.showHiddenThemeLayers();
    } else {
        vmap.hideAllThemeLayers();
    }
}

var themeLayer4;
function setThemeLayer4() {
    if (themeLayer4 != null) {
        vmap.removeLayer(themeLayer4);
        themeLayer4 = null;
        vmap.getView().setCenter([14129709.590359, 4512313.7639686]);
        vmap.getView().setZoom(15);
    } else {
        if (themeLayer4 == null) {
            var _options = {
                maxZoom: 17,
                minZoom: 9
            };
            themeLayer4 = vmap.addTileCacheLayer("산사태위험지도", 'SANSATAI',
                _options);
            vmap.addLayer(themeLayer4);
            vmap.getView().setZoom(9);
        }
    }
}

var themeLayer5;
function setThemeLayer5() {
    if (themeLayer5 != null) {
        vmap.removeLayer(themeLayer5);
        themeLayer5 = null;
    } else {
        themeLayer5 = vmap.addNamedLayer("도시지역", 'LT_C_UQ111');
        vmap.addLayer(themeLayer5);
    }
}

var themeLayer6;
function setThemeLayer6() {
    if (themeLayer6 != null) {
        vmap.removeLayer(themeLayer6);
        themeLayer6 = null;
    } else {
        themeLayer6 = vmap.addNamedLayer("교통CCTV", 'LT_P_UTISCCTV');
        vmap.addLayer(themeLayer6);
    }
}

// 행정 경계지도.
var themeLayer9;
function setThemeLayer9() {
    if (themeLayer9 != null) {
        vmap.removeLayer(themeLayer9);
        themeLayer9 = null;
    } else {
        if ($('#param').val() == '') {
            alert('기준년도를 입력하세요\n2012, 2011, 2010, 2009 년도 광역시도를 지원합니다.');
            $('#param').val('2012');
            $('#param').focus();
            return;
        } else {
            var check = false;
            var yArray = ['2012', '2011', '2010', '2009'];
            for (var i = 0; i < yArray.length; i++) {
                if ($('#param').val() == yArray[i]) check = true;
            }

            if (!check) {
                alert('현재 2012, 2011, 2010, 2009 년도 광역시도를 지원합니다.');
                return;
            }
        }

        themeLayer9 = vmap.addWMSBoundaryLayer("행정경계지도-시도",
            'LT_C_ADSIDO', $('#param').val());
        vmap.addLayer(themeLayer9);
        $('#param').val('');
        vmap.getView().setZoom(12);
    }
}

var kmlLayer;
function kmlLayerAdd() {
    if (kmlLayer != null) {
        vmap.removeLayer(kmlLayer);
        kmlLayer = null;
        vmap.getView().setCenter([14129709.590359, 4512313.7639686]);
        vmap.getView().setZoom(14);
    } else {
        var styleCache = {};
        var styleFunction = function (feature, resolution) {
            var name = feature.get('name');
            var magnitude = parseFloat(name.substr(2));
            var radius = 5 + 20 * (magnitude - 5);
            var style = styleCache[radius];
            if (!style) {
                style = [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: radius,
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 153, 0, 0.4)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 204, 0, 0.2)',
                            width: 1
                        })
                    })
                })];
                styleCache[radius] = style;
            }
            return style;
        };

        kmlLayer = vmap
            .addKMLLayer(
                "http://localhost:9002/kml/ZiumksTestingGIS.kml",
                styleFunction);
        vmap.addLayer(kmlLayer);
        vmap.getView().setZoom(6);
    }
}

var markerLayer;
function addMarkerLayer() {
    if (markerLayer != null) {
        vmap.removeLayer(markerLayer);
        markerLayer = null;
        vmap.getView().setCenter([14129709.590359, 4512313.7639686]);
        vmap.getView().setZoom(15);
    } else {
        markerLayer = new vw.ol3.layer.Marker(vmap);
        vmap.addLayer(markerLayer);
        addMarker();
        vmap.getView().setCenter([14115633.03459599, 4492228.092116951]);
        vmap.getView().setZoom(9);
    }
}

function addMarker() {
    vw.ol3.markerOption = {
        x: 126.24,
        y: 37.4,
        epsg: "EPSG:4326",
        title: '테스트마커1',
        contents: '테스트마커1 본문내용',
        iconUrl: 'http://10.1.2.112/images/ol3/marker_blue.png'
    };
    markerLayer.addMarker(vw.ol3.markerOption);

    vw.ol3.markerOption = {
        x: 14164292.00853613,
        y: 4495009.258626321,
        epsg: "EPSG:900913",
        title: '테스트마커2',
        contents: '테스트마커2 본문내용<br>테스트마커2 본문내용',
        iconUrl: 'http://10.1.2.112/images/ol3/btn_area.png'
    };
    markerLayer.addMarker(vw.ol3.markerOption);

    vw.ol3.markerOption = {
        x: 14129709.590359,
        y: 4442313.7639686,
        epsg: "EPSG:3857",
        title: '브이월드로 가자',
        contents: "<a href='http://map.vworld.kr' target='_blank'>브이월드로 GOGOGO</a><br><br><a href='http://dev.vworld.kr' target='_blank'>개발자센터 GOGOGO</a>"
    };
    markerLayer.addMarker(vw.ol3.markerOption);
}

function checkMarkerParam() {
    if (markerLayer == null) {
        alert("마커레이어가 생성되지 않았습니다.\n마커입력버튼을 먼저 실행하십시요.");
        return false;
    }
    vw.ol3.markerOption = {
        epsg: "EPSG:5179",
        title: '네이버좌표계',
        contents: '덕수초등학교'
    };
    markerLayer.addMarker(vw.ol3.markerOption);
}

var textLayer;
var distance = 100;

function addTextLayer(fileObj, epsgCode) {
    var epsg = epsgCode;
    if (textLayer == null) {
        textLayer = new vw.ol3.layer.TEXTLayer(vmap, epsg);
    } else {
        vmap.removeLayer(textLayer);
        textLayer = null;
        textLayer = new vw.ol3.layer.TEXTLayer(vmap, epsg);
    }
    vmap.getView().setZoom(8);
    var files = fileObj.toString();
    textLayer.readDraw(epsg, distance, files);
}

function isSelectMarker() {
    if (markerLayer == null) {
        alert("마커레이어가 생성되지 않았습니다.\n마커입력버튼을 먼저 실행하십시요.");
        return false;
    } else {
        if (this.markerLayer.getSource().getFeatures().length < 1) {
            alert("생성된 마커가 없습니다.");
            return false;
        } else {
            if ($('#param').val() == '') {
                alert("선택된 마커가 없습니다. 마커에 마우스를 올리세요.");
                return false;
            } else {
                return true;
            }
        }
    }
}

function hideMarker() {
    if (isSelectMarker()) {
        this.markerLayer.hideMarker(selectMarker);
    }
}
function showMarker() {
    if (isSelectMarker()) {
        this.markerLayer.showMarker(selectMarker);
        $('#param').val('');
    }
}

function hideAllMarker() {
    if (markerLayer == null) {
        alert("마커레이어가 생성되지 않았습니다.\n마커입력버튼을 먼저 실행하십시요.");
    } else {
        this.markerLayer.hideAllMarker();
    }
}

function showAllMarker() {
    if (markerLayer == null) {
        alert("마커레이어가 생성되지 않았습니다.\n마커입력버튼을 먼저 실행하십시요.");
    } else {
        this.markerLayer.showAllMarker();
    }
}

function removeMarker() {
    if (isSelectMarker()) {
        var features = this.markerLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if ($('#param').val() == features[i].get('id')) {
                this.markerLayer.removeMarker(selectMarker);
                $('#param').val('');
                selectMarker = null;
            }
        }
    }
}

function removeAllMarker() {
    if (markerLayer == null) {
        alert("마커레이어가 생성되지 않았습니다.\n마커입력버튼을 먼저 실행하십시요.");
    } else {
        this.markerLayer.removeAllMarker();
    }
}

function addPieChart() {
    if (bar != null) {
        alert("차트레이어가 생성되어 있습니다.");
        return;
    }
    pos = [14135087.165466234, 4518348.216242027];
    // 사이즈 적용 안됨..
    var radius = 60;
    bar = new vw.ol3.chart.Pie(radius);
    bar.title = "서울특별시";

    bar.legend = new vw.ol3.chart.ChartLegend();
    bar.legend.visible = true;

    var styles = new Array();
    styles[0] = {
        color: '#d26900',
        label: '아동',
        legendLabel: "아동"
    };
    styles[1] = {
        color: '#d89243',
        label: "남",
        legendLabel: "남"
    };
    styles[2] = {
        color: "#726056",
        label: "여",
        legendLabel: "여"
    };
    bar.styles = styles;
    bar.values = [50, 30, 20];
    bar.setPosition(pos);
    bar.draw();
    vmap.addOverlay(bar);

    pos1 = [14368561.826988406, 4188338.9015740836];
    var radius = 80;
    bar1 = new vw.ol3.chart.Pie(radius);
    bar1.title = "부산광역시";

    bar1.legend = new vw.ol3.chart.ChartLegend();
    bar1.legend.visible = true;

    var styles1 = new Array();
    styles1[0] = {
        color: '#d26900',
        label: '성인',
        legendLabel: "성인"
    };
    styles1[1] = {
        color: '#d89243',
        label: "남",
        legendLabel: "남"
    };
    styles1[2] = {
        color: "#726056",
        label: "여",
        legendLabel: "여"
    };
    bar1.styles = styles1;
    bar1.values = [60, 35, 5];
    bar1.draw();
    bar1.setPosition(pos1);
    vmap.addOverlay(bar1);

    vmap.getView().setCenter([14244465.752958824, 4342152.888777574])
    vmap.getView().setZoom(7);
};

function pieChartHide() {
    if (bar == null) {
        alert("차트레이어가 생성되지 않았습니다.");
        return;
    }
    if (bar != null) {
        bar.setVisible(false);
    }

    if (bar1 != null) {
        bar1.setVisible(false);
    }
}

function pieChartShow() {
    if (bar == null) {
        alert("차트레이어가 생성되지 않았습니다.");
        return;
    }
    if (bar != null) {
        bar.setVisible(true);
    }
    if (bar1 != null) {
        bar1.setVisible(true);
    }

}

function clearChart() {
    if (bar == null) {
        alert("차트레이어가 생성되지 않았습니다.");
        return;
    }
    if (bar != null) {
        try {
            vmap.removeOverlay(bar);
            bar = null;
        } catch (e) {
        }

    }
    if (bar1 != null) {
        try {
            vmap.removeOverlay(bar1);
            bar1 = null;
        } catch (e) {
        }
    }
    vmap.getView().setCenter([14129709.590359, 4512313.7639686]);
    vmap.getView().setZoom(15);
}

function jsCreatRoute(mapName) {
    //RouteMap생성
    if (mapName == 'test1') {
        routeMap1 = new vw.ol3.control.RouteMap(vmap, mapName, null, "http://static.naver.com/maps2/icons/pin_spot2.png");
        routeMap1.setFunction(mClick1);
    } else {
        routeMap2 = new vw.ol3.control.RouteMap(vmap, mapName, null, "http://static.naver.com/maps2/icons/pin_spot2.png");
        routeMap2.setFunction(mClick2);
    }

};

function jsAddRouteEvent(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.start();
    } else {
        routeMap2.start();
    }


};

/**
 * 말풍선이벤트
 */
function mClick1(event) {
    //var coordinate = event.coordinate;
    var coordinate = routeMap1.coordinate_;

    if (coordinate != null) {
        document.getElementById('mousex').value = coordinate[0];
        document.getElementById('mousey').value = coordinate[1];
        //경로추가
        routeMap1.addRoute(routeMap1.mapName, "test1", "test1 sample", coordinate);
    }
};

function mClick2(event) {
    //var coordinate = event.coordinate;
    var coordinate = routeMap2.coordinate_;

    if (coordinate != null) {
        document.getElementById('mousex').value = coordinate[0];
        document.getElementById('mousey').value = coordinate[1];
        //경로추가
        routeMap2.addRoute(routeMap2.mapName, "test2", "test2 sample", coordinate);
    }
};

function jsInit(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.stop();
    } else {
        routeMap2.stop();
    }
};

function setColor(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.setColor(mapName, "#990033");
    } else {
        routeMap2.setColor(mapName, "#990033");
    }
};

function setWidth(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.setWidth(mapName, 20);
    } else {
        routeMap2.setWidth(mapName, 20);
    }

};

function jsSelectRoute(mapName) {
    if (mapName == 'test1') {
        routeMap1.returnRouteMap(mapName);
        alert("경로 개수 : " + (routeMap1.features.getLength() + 1) / 2);
    } else {
        routeMap2.returnRouteMap(mapName);
        alert("경로 개수 : " + (routeMap2.features.getLength() + 1) / 2);
    }

}

function jsRemoveRoute(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.removeRouteMap(mapName);
    } else {
        routeMap2.removeRouteMap(mapName);
    }

}

function closeAllPop(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.closeAllPop();
    } else {
        routeMap2.closeAllPop();
    }
}

function openAllPop(mapName) {
    if (routeMap1 == null) {
        alert("경로레이어가 생성되지 않았습니다.");
        return;
    }
    if (mapName == 'test1') {
        routeMap1.openAllPop();
    } else {
        routeMap2.openAllPop();
    }
}

function mashUpWithDaum(lat, lot, id) {

    //ECMA를 AJAX를 사용해서 호출 하는 코드
    /*    var url = "/translateEPSG?latitude="+lat+"&longitude="+lot;
     /!*ECMA Trasnlater 호출*!/
     $.ajax({
     url: url,
     success: function (result) {
     //setting(result[0],result[1],id);
     setting(lat,lot,id);
     }
     });*/
    alert(lat + " " + lot + " " + id);
    setting(lat, lot, id);
}