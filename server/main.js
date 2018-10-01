//TODO join/leave messages (with player id))
//TODO chat
//TODO server authorization

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8001 });


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  //output: process.stdout
});

var stopTimer;
rl.on('line', (line) => {
  console.log(`Command sent: ${line}`);
  commands = line.split(" ");
  switch(commands[0]){
	case "/help":
		console.log("/kick [playerID] (reason) to kick a player from the game.\r\n/stop (seconds) to stop server. /clear to clear a stop timer.");
	break;
	case "/kick":
		if(!commands[1]){
			console.log("No player given, usage: /kick [playerID]");
		}else{
			wss.clients.forEach(function each(client) {
				if(client.playerid == commands[1]){
					console.log("JA");
					client.close();
				}
			  });
			broadcast(4+","+-1+","+"Kicked player: " + commands[1] + " because of " + commands[2]);
		}
	break;
	case "/stop":
		if(commands[1]){
			console.log("Set server to quit in: " + commands[1] + " seconds with reason: " + commands[2]);
			stopTimer = setTimeout((function() {  
				return process.exit(0);
			}), commands[1]*1000);
		}else{
			process.exit(0);
		}
		broadcast(4+","+-1+","+"Server shutting down in: " + commands[1] + " seconds because of " + commands[2]);
	break;
	case "/clear":
		clearTimeout(stopTimer);
		broadcast(4+","+-1+","+"Server shutdown interrupted by server.");
	break;
	default:
		broadcast(4+","+-1+","+line);	
		//console.log("Command not found, try: /help");
	break;
  }
});


var maxPlayers = 20;
var playerList = new Array(maxPlayers).fill();
console.log("Server started, max players:",maxPlayers);


wss.on('connection', function connection(ws) {
	console.log("Client connected.");
	//Create Player
	var player = {};
	player.name = "Not set";
	player.x = 50;
	player.y = 50;	
	
	
	var id = findEmptyPlayerSlot();
	
	//Check if server is full, and if so disconnect the client (will automatically attempt to reconnect, thus making a queue)
	if(id >= maxPlayers){
		ws.terminate();
		ws.close();
		console.log("Server is full!");
		return;
	}
	//If a player joins, send him all current players.
	playerList.forEach(function(element) {
		if(element != undefined){
			ws.send("0,"/*connect*/ + element.id + "," + element.name);
		}
	});
	playerList[id] = player;
	playerList[id].id = id;
	ws.playerid = id;
	console.log("Player List:",playerList);
	//Send the other players the new who joined.
	console.log(id + " joined.");
	broadcast(0/*connect*/ + "," + player.id,ws);
	
	
	ws.on('message', (msg)=>{
		//console.log(msg);
		var args = String(msg).split(",");
		//console.log("RECEIVE:",args);
		switch(parseInt(args[0])){
			case 2: //location
				player.x = parseInt(args[1]);
				player.y = parseInt(args[2]);
				broadcast(2/*Location*/ + "," + player.id + "," + args[1] + "," + args[2],ws);
			break;
			case 3: //set name
				broadcast(3/*set name*/ + "," + player.id + "," + args[1],ws);
				player.name = args[1];
				console.log("Player name changed",player.name);
			break;
			case 4:
				broadcast(4/*send chat*/ + "," + player.id + "," + args[1],ws);
				console.log(id + " said: " + args[1]);
			break;
		}
	});
	
	ws.isAlive = true;
	ws.on('pong', heartbeat);
	ws.on('error', (err)=>{
		console.log(err); 
	});
	ws.on('close', ()=>{
		console.log(player.id + " - " + player.name + " has left the server.");
		broadcast(1/*Disconnect*/ + "," + player.id,ws);
		delete playerList[id];
	});
	

});

function broadcast(data,exception) {
  wss.clients.forEach(function each(client) {
	if (client.readyState === WebSocket.OPEN && client != exception) {
	  client.send(data);
	}
  });
};

function findEmptyPlayerSlot(){
	for (var i = 0; i < playerList.length; i++) {
		if(playerList[i] == undefined){
			return i;
		}	
	}
	return playerList.length;
}

//Hearthbeat check (as in example of WS library)
function heartbeat() {
  this.isAlive = true;
}
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);
function noop() {}

