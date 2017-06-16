var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

//Kører serveren på hvad der er på enviroment variable PORT eller port 3000 --> 3000 i mit tilfælde
server.listen(process.env.port || 3000);
console.log('server is running....'); //Testing Dukker op i nodes cmd når den kører

/*Laver en rute som er hjemmesiden eller /. Når man besøger den kører den en finction
Som har et request og respons. response er at den sender fil med __dirname returns the directory that the
currently executing script is in
Og den sender /index.html med, fordi det er i den fil.*/
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});


//Socket connection
/*Tager connections array'et .push fordi vi gerne vil tilføje den til socket
 %s er antal sockets*/
io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length); //Testing

  //Disconnect
socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected ', connections.length ); //TElls how many there are stil connected

  });

  // Send message
  socket.on('send message', function(data){
      console.log(data); //Testing
      io.sockets.emit('new message',{msg: data, user: socket.username});
  });

  //New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});
