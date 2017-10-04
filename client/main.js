function connect(server,connectionData){
	var socket = io.connect(server,connectionData);
	
	//Set up canvas
	var canvas = document.createElement("canvas");
	canvas.innerHTML="Your browser doesn't support canvas. Try google chrome."
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.2)';
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	//Auto resize
	resize_canvas();
	function resize_canvas(){
		if (canvas.width  != window.innerWidth)
		{
			canvas.width  = window.innerWidth;
		}
		if (canvas.height != window.innerHeight)
		{
			canvas.height = window.innerHeight;
		}
	}
	//function resize_canvas(){}
	window.addEventListener("resize", resize_canvas);
	window.addEventListener("orientationchange", resize_canvas);


	var now;
	var then = Date.now();
	var delta;

	requestAnimationFrame(main);//Start loop
	function main(timestamp){
		ctx.clearRect(0,0, window.innerWidth,window.innerHeight);
		delta = timestamp - then;
		if(socket.connected){
			//ctx.fillText("Amount of players: " + (playerList.length+1),10,60);
			//updateObjects(delta / 1000);
			//renderObjects(delta / 1000);
			//console.log("Connected");
			ctx.fillText("Connected!",10,20);
			then = timestamp;//Update delta-timing
			requestAnimationFrame(main);
		}else{
			ctx.fillText("Not connected!",10,20);
			ctx.fillText("Trying to connect",10,30);
			console.log("CONNECTED: " + socket.connected);
			setTimeout(main,1000);
		}
	};
}

