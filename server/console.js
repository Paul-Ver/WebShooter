const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  //output: process.stdout
});

var stopTimer;
rl.on('line', (line) => {
  log(`Command sent: ${line}`);
  commands = line.split(" ");
  switch(commands[0]){
	case "/help":
		log("/kick [playerID] (reason) to kick a player from the game.\r\n/stop (seconds) to stop server. /clear to clear a stop timer.");
	break;
	case "/list":
		playerList.forEach(function(element) {
			log("Playerlist");
			if(element != undefined){
				log("["+ element.id + "] " + element.name);
			}
		});
		break;
	case "/kick":
		if(!commands[1]){
			log("No player given, usage: /kick [playerID]");
		}else{
			wss.clients.forEach(function each(client) {
				if(client.playerid == commands[1]){
					log("JA");
					client.close();
				}
			  });
			broadcast(MSG.CHAT+","+-1+","+"Kicked player: " + commands[1] + " because of " + commands[2]);
		}
	break;
	case "/stop":
		if(commands[1]){
			log("Set server to quit in: " + commands[1] + " seconds with reason: " + commands[2]);
			stopTimer = setTimeout((function() {  
				return process.exit(0);
			}), commands[1]*1000);
		}else{
			process.exit(0);
		}
		broadcast(MSG.CHAT+","+-1+","+"Server shutting down in: " + commands[1] + " seconds because of " + commands[2]);
	break;
	case "/clear":
		clearTimeout(stopTimer);
		broadcast(MSG.CHAT+","+-1+","+"Server shutdown interrupted by server.");
	break;
	default:
		broadcast(MSG.CHAT+","+-1+","+line);	
		log("Command not found, try: /help");
	break;
  }
});