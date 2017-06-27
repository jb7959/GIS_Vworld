var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var gis = require('./routes/map');
var kml = require('./routes/kml');
var log = require('./routes/log');
var daumRoadView = require('./routes/daumRoadView');
var ziumGisService = require('./routes/ziumGisService');
var translateEPSG = require('./routes/TranslateEPSG');

var app = express();

app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/gis', gis);
app.use('/kml', kml);
app.use('/roadmap', daumRoadView);
app.use('/ziumGIS', ziumGisService);
app.use('/log', log);
app.get('/translateEPSG',translateEPSG);

/*app.get('/translateEPSG',function (req, res) {
    var latitude = req.param("latitude");
    console.log(latitude);
    //var longitude = request.params.longitude;
    res.send("latitude" + latitude);
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




//서버 실행
app.listen(9002, function () {
    console.log('Example app listening on port 9002!');
});