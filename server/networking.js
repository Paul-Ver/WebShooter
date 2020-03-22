const WebSocket = require('ws');
const Player = require('./player');

class Network{
	constructor(wsport,maxPlayers){
		log(`Starting server on: ${wsport}`)
		this.playerList = new Array(maxPlayers).fill();
		this.wss = new WebSocket.Server({ port: wsport });
		this.wss.on('connection', (ws)=>{
			let id = this.findEmptyPlayerSlot();
			if (id == -1) {
				ws.terminate();
				ws.close();
				log("Player tried to join, server is full!");
				return;
			}
			for(let player of this.playerList){
				if(player != undefined){
					ws.send(`${MSG.JOIN},${player.id},${player.name}`);
				}
			}
			this.broadcast(`${MSG.JOIN},${id},unset`)
			this.playerList[id] = new Player();
			this.playerList[id].id = id;
			log(`Player ${id}: joined the server.`);
			ws.on('message', (msg)=>{this.handleMessage(msg, id, ws)});
			ws.on('close', () => {this.close(id)});
		});
	}
	handleMessage(msg, id, ws){
		const args = String(msg).split(",");
		switch(parseInt(args[0])){
			case MSG.RENAME:
				log(`Player ${id}: name "${this.playerList[id].name}" changed to "${args[1]}"`);
				this.playerList[id].name = args[1];
				this.broadcast(`${MSG.RENAME},${id},${args[1]}`);
				break;
			case MSG.CHAT:
				log(`Player ${id}: ${this.playerList[id].name} said: ${args[1]}`);
				this.broadcast(`${MSG.CHAT},${id},${args[1]}`,ws);
				break;
			default:
				log(`Server Unhandled Received: ${msg}`);
				break;
		}
	}
	broadcast(msg,exception){
		for(let client of this.wss.clients){
			if (client.readyState === WebSocket.OPEN && client != exception) {
				client.send(msg);
			}
		}
	}
	close(id){
		log(`Player ${id}: ${this.playerList[id].name} has left the server.`);
		this.broadcast(MSG.LEAVE + "," + id);
		delete this.playerList[id];
	}
	findEmptyPlayerSlot(){
		for (var i = 0; i < this.playerList.length; i++) {
			if (this.playerList[i] == undefined) {
				console.log("Empty player slot " + i);
				return i;
			}
		}
		return -1;
	}
}
module.exports = Network;