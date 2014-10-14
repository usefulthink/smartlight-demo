var L8 = require("l8smartlight").L8,

    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    serveStatic = require('serve-static');

// initialize the l8smartlight
var l8 = new L8('/dev/tty.usbmodem1411');

l8.open()
    .then(function () { return l8.clearMatrix(); })
    .catch(function (error) { console.error(error.stack); });

// serve static files from /public
app.use(serveStatic(__dirname + '/public'));

io.on('connection', function (socket) {
    // client will send pixeldata that is directly forwarded to the l8
    socket.on('pixeldata', function(data) {
        if(l8.isConnected) {
            l8.setMatrix(data);
        }
    });
});

// startt http-server
server.listen(9000);