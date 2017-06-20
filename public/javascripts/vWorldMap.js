var map = null;
vworld.showMode = false;
vworld.init(
    "cont1"	// rootDiv
    , "map-first" // mapType(map=배경지도, raster=항공사진, earth=3D지도)
    ,function() {
        map = this.vmap;
        //기본맵 설정
        map.setBaseLayer(map.vworldBaseMap);
        map.setControlsType({"simpleMap":true});	//간단한 화면
        //화면중심점과 레벨로 이동
        map.setCenterAndZoom(14135792.751626197, 4512051.278263237, 12);
    }
    ,function (obj){SOPPlugin = obj; }//initCallback
    ,function (msg){alert('oh my god');}//failCallback
);

//2D/3D 전환후에 실행할 콜백함수 지정
function setModeCallback(){
    vworld.setModeCallback(modecallback);
}