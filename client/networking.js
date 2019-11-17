function connect(uri,nom){
	server = uri;
	name = nom;
	playerList.fill(undefined);
	socket = new WebSocket(server);
	socket.onmessage = function (event) {
	  var args = String(event.data).split(',');
	  //console.log(args);
	  switch(parseInt(args[0])){
		  case MSG.JOIN://Player join
			playerList[parseInt(args[1])] = new OtherPlayer();
			playerList[parseInt(args[1])].name = args[2];
			playerList[parseInt(args[1])].id = args[1];
		  break;
		  case MSG.LEAVE://Player leave
			playerList[parseInt(args[1])] = undefined;
		  break;
		  case MSG.LOCATION://Player location change
			//2 , ID , X , Y
			playerList[parseInt(args[1])].x = args[2];
			playerList[parseInt(args[1])].y = args[3];
		  break;
		  case MSG.RENAME://Rename
			playerList[parseInt(args[1])].name = args[2];
		  break;
		  case MSG.CHAT://Chat message
			if(args[1] == -1){
				addToChat("[SERVER] "+args[2]);
				//console.log("[Server]:",args[2]);
			}else{
				addToChat(playerList[parseInt(args[1])].name + ": " + args[2]);
			}
		  break;
	  }
	}
	socket.onerror = function (err){
		console.log("Socket.onerror:",err);
	}
	socket.onclose = function (event){
		console.log("Connection closed.");
		reconnecting = false;
	}
	socket.onopen = function(){
		socket.send(MSG.RENAME + "," + nom);
		console.log("Connected.");
		clearTimeout(reconnect);
		reconnecting = false;
	}
}

