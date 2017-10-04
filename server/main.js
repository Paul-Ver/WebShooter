//Server
var io = require('socket.io').listen(8001);
console.log("Server started.");

var playerList = [];

io.use(function(socket, next) {
  console.log("Join request:", socket.handshake.query);
  if(true){//TODO auth
	  console.log("Auth succesfull");
	  next();
  }
});
io.sockets.on('connection', function(socket){
	console.log('socket connection');
	var player = {};
	var id = socket.id;
	var obj = {};
	obj.id = id;
	obj.player = player;
	playerList.push(obj);
	console.log(playerList);
});