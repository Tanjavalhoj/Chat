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
// Åbner en connection med socket.io, .on betyder event
/*Tager connections array'et .push fordi vi gerne vil tilføje den til socket
 %s er antal sockets*/
io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length); //Testing


  //Disconnect
    /* påsætter 'disconnect' functionen på socket, derefter bliver username fjernet fra users array, via splice
    * så bliver usernames opdateret, derefter bliver den socket forbindelse fjernet fra connections array
    * i cmd, fortæller den at der er en der er disconnected og --antal-- sockets er connected*/
socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected ', connections.length ); //antal connected

  });

  // Send message
    /* påsætter 'send message' function på socket, der bliver lavet et socket event der hedder 'send message'
    som bliver sendt til alle aktive clients
     * og den event indeholder message og username */
  socket.on('send message', function(data){
      console.log(data); //Testing
      io.sockets.emit('new message',{msg: data, user: socket.username});
  });

  //New User
    /* påsætter 'new user' function på socket, med data og callback objekt. callback bliver sat til true
    * username der kaldes fra socket, bliver til data
    * der bliver tilføjet den nye user (username) til users array, og usernames bliver opdateret*/
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    // laver et socket event, der hedder 'get users' og som inde holder users
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});
