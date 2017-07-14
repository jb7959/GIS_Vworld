/**
 * Created by 안재열 on 2017-06-23.
 */
var vmap;

vw.ol3.MapOptions = {
    basemapType: vw.ol3.BasemapType.GRAPHIC,
    controlDensity: vw.ol3.DensityType.BASIC,
    interactionDensity: vw.ol3.DensityType.FULL,
    controlsAutoArrange: true,
    homePosition: vw.ol3.CameraPosition,
    initPosition: vw.ol3.CameraPosition
};

vmap = new vw.ol3.Map("vmap", vw.ol3.MapOptions);

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

var kmlLayer = vmap
    .addKMLLayer(
        "http://openlayers.org/en/v3.11.2/examples/data/kml/2012_Earthquakes_Mag5.kml",
        styleFunction);
vmap.addLayer(kmlLayer);

var info = $('#info');
info.tooltip({
    animation: false,
    trigger: 'manual'
});

var displayFeatureInfo = function (pixel) {
    info.css({
        left: pixel[0] + 'px',
        top: (pixel[1] - 15) + 'px'
    });
    var feature = vmap.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return feature;
    });
    if (feature) {
        info.tooltip('hide').attr('data-original-title',
            feature.get('name')).tooltip('fixTitle')
            .tooltip('show');
    } else {
        info.tooltip('hide');
    }
};

vmap.on('pointermove', function (evt) {
    if (evt.dragging) {
        info.tooltip('hide');
        return;
    }
    displayFeatureInfo(vmap.getEventPixel(evt.originalEvent));
});