require('../client/common');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8001 });

log("Server started, max players:",maxPlayers,MSG.JOIN);
wss.on('connection', function connection(ws) {
	log("Client connected.");
	//Create Player
	var player = {};
	player.name = "Not set";
	player.x = 0;
	player.y = 0;	
	
	
	var id = findEmptyPlayerSlot();
	
	//Check if server is full, and if so disconnect the client (will automatically attempt to reconnect, thus making a queue)
	if(id >= maxPlayers){
		ws.terminate();
		ws.close();
		log("Server is full!");
		return;
	}
	//If a player joins, send him all current players.
	playerList.forEach(function(element) {
		if(element != undefined){
			ws.send(MSG.JOIN + ","/*connect*/ + element.id + "," + element.name);
		}
	});
	playerList[id] = player;
	playerList[id].id = id;
	ws.playerid = id;
	log("Player List:",playerList);
	//Send the other players the new who joined.
	log(id + " joined.");
	broadcast( MSG.JOIN + "," + player.id,ws);
	
	
	ws.on('message', (msg)=>{
		//log(msg);
		var args = String(msg).split(",");
		//log("RECEIVE:",args);
		switch(parseInt(args[0])){
			case MSG.LOCATION: //location
				player.x = parseInt(args[1]);
				player.y = parseInt(args[2]);
				broadcast( MSG.LOCATION + "," + player.id + "," + args[1] + "," + args[2],ws);
			break;
			case MSG.RENAME: //set name
				broadcast( MSG.RENAME + "," + player.id + "," + args[1],ws);
				player.name = args[1];
				log(player.id + " name changed",player.name);
			break;
			case MSG.CHAT:
				broadcast( MSG.CHAT + "," + player.id + "," + args[1],ws);
				log(id + " said: " + args[1]);
			break;
		}
	});
	
	ws.isAlive = true;
	ws.on('pong', heartbeat);
	ws.on('error', (err)=>{
		log(err); 
	});
	ws.on('close', ()=>{
		log(player.id + " - " + player.name + " has left the server.");
		broadcast( MSG.LEAVE + "," + player.id,ws);
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