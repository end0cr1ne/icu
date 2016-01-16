var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 80);

io.peers=[];

app.use(express.static('app'));
app.use('/bower_components', express.static('bower_components'));

io.on('connection', function (socket) {
    socket.on('new', function (data) {
        socket.emit('peers',io.peers);
        io.peers.push({name:data.name, id:data.id, sid:socket.id});
        socket.broadcast.emit('peers',io.peers);
        console.log(data);
    });

    socket.on('disconnect', function () {
        io.peers=io.peers.filter(function(val){
            if('sid' in val && val.sid!=socket.id)return true;
            else return false;
        });
        socket.broadcast.emit('peers',io.peers)
    });
});