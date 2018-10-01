var debugLevel = 10;
var playerList = new Array();


function log(priority, message, color){
	if(debugLevel >= priority){
		console.log(message);
	}
}

class OtherPlayer extends playerBody{
	constructor(){
		super();
	}
}

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var socket;
var reconnect;
var reconnecting = false;
var server;
var name;

function start(){
	//Set up canvas
	//canvas.setAttribute("id", "game");
	//document.body.appendChild(canvas);
	canvas.innerHTML="Your browser doesn't support canvas. Try updating or google chrome.";
	
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
		log(5,"Resize: " + canvas.width + " x " + canvas.height);
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
		ctx.beginPath();
		delta = timestamp - then;
		if(socket.readyState === socket.OPEN){
			clearTimeout(reconnect);
			reconnecting = false;
			updateObjects(delta / 1000);
			renderObjects(delta / 1000);
			renderGUI(10,canvas.height-(chatListLength*10+10));
			ctx.fillText("Connected!",10,20);
			then = timestamp;//Update delta-timing
			requestAnimationFrame(main);
		}else{
			ctx.fillText("Not connected!",10,20);
			if(reconnecting == false){
				ctx.fillText("Trying to reconnect.",10,30);
				reconnecting = true;
				clearTimeout(reconnect);
				reconnect = setTimeout(()=>{
					socket.close();
					socket = undefined;
					connect(server,name);
				},5000);
			}
			setTimeout(main,1000);
		}
	};
}

//Render objects and player
function renderObjects(delta){
	playerList.forEach(function(element) {
		ctx.beginPath();
		if(element !== undefined){
			element.render(delta,"[" + element.id + "] " + element.name);
		}
	});	
	ctx.beginPath(); 
		player.render(delta,"Jij");
}
function updateObjects(delta){
	playerList.forEach(function(element) {
		if(element !== undefined){
			element.update();
		}
	});
	player.update();
}



