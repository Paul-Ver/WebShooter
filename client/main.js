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

var lastTick = performance.now();
var deltaTick = 0;
var currentTick = 0;

function start(){
	//Set up canvas
	//canvas.setAttribute("id", "game");
	//document.body.appendChild(canvas);
	canvas.innerHTML="Your browser doesn't support canvas. Try updating or google chrome / firefox.";
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


	var lastTime = performance.now();
    var currentTime = 0;
    var drawDelta = 0;

	requestAnimationFrame(main);//Start loop
	setInterval(updateObjects, 1000/60);
	function main(){
		ctx.clearRect(0,0, window.innerWidth,window.innerHeight);
		ctx.beginPath();
		currentTime = performance.now();
		drawDelta = (currentTime - lastTime) / 1000;
		//console.log("Cur",currentTime,"Last",lastTime,"Delta",drawDelta);
		if(socket.readyState === socket.OPEN){
			clearTimeout(reconnect);
			reconnecting = false;
			renderObjects(drawDelta);
			renderGUI(10,canvas.height-(chatListLength*10+10));
			ctx.fillText("Connected!",20,10);
			if(debugLevel>5){
				ctx.fillText("FPS:" + Math.round(1/drawDelta),20,20);
				ctx.fillText("Tickrate:" + Math.round(1/deltaTick),20,30);
			}
			lastTime = currentTime;//Update delta-timing
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
function updateObjects(){
	currentTick = performance.now();
	deltaTick = (currentTick - lastTick) / 1000;
	playerList.forEach(function(element) {
		if(element !== undefined){
			element.update(deltaTick);
		}
	});
	player.update(deltaTick);
	lastTick = currentTick;//Update delta-timing
}



