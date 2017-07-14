var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
var roadview = new daum.maps.Roadview(roadviewContainer); //로드뷰 객체
var roadviewClient = new daum.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
//EPSG :5181
//33.47529381280576,124.849823218775
var latitude = 37.523777423;
var longitude = 126.92687777;
var locationName = "지음지식서비스";
var position = new daum.maps.LatLng(latitude, longitude);

//37.523777423 , 126.92687777

//초기화실행
InitDoumRoadmap();


function setting(lat, lgt, loName) {
    latitude = lat;
    longitude = lgt;
    position = new daum.maps.LatLng(lat, lgt);
    locationName = loName;
    InitDoumRoadmap(); //초기화 재실행
}

function InitDoumRoadmap() {
    // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
    roadviewClient.getNearestPanoId(position, 50, function (panoId) {
        roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
        roadview.setViewpoint({pan: 0, tilt: 7.0, zoom: -5});

        //로드뷰 초기화 이벤트 발생('init') 후 콜백함수 동작
        daum.maps.event.addListener(roadview, 'init', function () {
            // 로드뷰에 올릴 마커를 생성합니다.
            var marker = new daum.maps.Marker({map: roadview, position: new daum.maps.LatLng(latitude, longitude)}); //EPSG :5181
            marker.setTitle(locationName);

            // 로드뷰에 올릴 장소명 인포윈도우를 생성합니다.
            var infowindow = new daum.maps.InfoWindow({
                position: new daum.maps.LatLng(latitude, longitude),
                content: locationName
            });
            infowindow.open(roadview, marker);
            alert("다음로드뷰 실행");
        });
    });
}
