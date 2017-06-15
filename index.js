// require Express and Socket.io
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');

// the object that will hold information about the active users currently
// on the site
var visitorsData = {};

app.set('port', (process.env.PORT || 5000));

// serve the static assets (js/dashboard.js and css/dashboard.css)
// from the public/ directory
app.use(express.static(path.join(__dirname, 'public/')));

// serve the index.html page when someone visits any of the following endpoints:
//    1. /
//    2. /about
//    3. /contact
app.get(/\/(about|contact)?$/, function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// serve up the dashboard when someone visits /dashboard
app.get('/visualize', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/webgl_interactive_raycasting_points.html'));
});

app.get('/vr', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/vr_basic.html'));
});

io.on('connection', function(socket_vr) {
	// var socket_vis = io.connect('visualize');
	// a user has visited our page - add them to the visitorsData object
	socket_vr.on('imu-data', function(data) {
    	console.log(data['imu']);
    	io.emit('receive-imu', data);
	})
	socket_vr.on('disconnect', function() {
	// a user has left our page - remove them from the visitorsData object
	});
});

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});
