class playerBody {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.rot = 0;
	}
	setRot(rot){
		this.rot = rot;
	}
	render(delta, id) {
		//Shoulders
		ctx.beginPath();
		
		ctx.save();
		ctx.moveTo(this.x, this.y);
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rot + 90 * Math.PI / 180);
		//ctx.roundRect(this.x-20, this.y-5, 40, 10, 3, "#0000FF")
		ctx.roundRect(-20, -5, 40, 10, 3, "#0000FF")
		ctx.restore();
		ctx.closePath();

		//Head
		ctx.beginPath();
		ctx.fillStyle = "#0B7F00";
		ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		ctx.textAlign = "center";
		ctx.fillStyle = "#000000";//Revert color to black
		ctx.fillText(String(id), this.x, this.y - 25);
		ctx.textAlign = "left";
	}
	update(delta) {

	}
}

class OtherPlayer extends playerBody {
	constructor() {
		super();
		this.rot = 0;
	}
	setRot(rot){
		super.setRot(rot);
		this.rot = rot;
	}
}

class Player extends playerBody {
	constructor() {
		super();
		this.chatting = false;
		this.chatBuffer = "";
	}

	update(delta) {
		var previousX = this.x;
		var previousY = this.y;
		var previousRot = this.rot;

		if (mouseScrolled) {
			//mouseScrollDelta
			mouseScrolled = false;
		}

		if (mouseDown.indexOf(1) >= 0) {//Left mouse
			//Shoot
			console.log("shoot");
		}
		if (mouseButtonChanged) {
			if (mouseDown.indexOf(2) >= 0) {//Middle mouse
				//?
			}
			if (mouseDown.indexOf(3) >= 0) {//Right mouse
				//Slower movement, secondary action
			}
			mouseButtonChanged = false;
		}

		if (keysDown[customKeys.chat] && keysChanged) {
			this.chatting = !this.chatting;
			log(9, "Is Chatting: " + this.chatting);
			chatVisibility = 2;
			//Send message and clear chatbuffer.
			if (!this.chatting && this.chatBuffer.length > 1) {
				chat(this.chatBuffer.slice(1));
				this.chatBuffer = "";
			}
		}
		if (this.chatting) {
			if (keysChanged && keysDown[-1]) {
				this.chatBuffer += keysDown[-1];
			}
			if (keysChanged && keysDown[customKeys.backspace]) {
				this.chatBuffer = this.chatBuffer.slice(0, -1);
				console.log(this.chatBuffer);
			}
		} else {
			if (keysDown[customKeys.left]) {
				this.x -= (100 * delta);
			}
			if (keysDown[customKeys.down]) {
				this.y += (100 * delta);
			}
			if (keysDown[customKeys.right]) {
				this.x += (100 * delta);
			}
			if (keysDown[customKeys.up]) {
				this.y -= (100 * delta);
			}
			//console.log(this.x,this.y,this.delta);
		}

		if (keysChanged) {
			//keys handled.
			keysChanged = false;
			delete keysDown[-1];
		}

		if (previousX != this.x || previousY != this.y) {
			socket.send(MSG.LOCATION + ',' + [this.x, this.y]);
		}

		var dx = mouseX - this.x, dy = mouseY - this.y;
		this.rot = Math.atan2(dy, dx);
		super.setRot(this.rot);
		if (previousRot != this.rot){
			console.log("rot changed");
			socket.send(MSG.ROTATION + ',' + this.rot);
		}
	}

	render(delta, id) {
		super.render(delta, id);//Head
		
		//Gun
		ctx.stroke();
		drawLineLength(this.x, this.y, mouseX, mouseY, 20);//Aim
	}
}
var player = new Player();

//Chatbox
var chatVisibility = 1;
var chatListLength = 10;
var chatHistory = new Array(chatListLength);
chatHistory.fill("");
function renderGUI(x, y) {
	ctx.beginPath();
	//ctx.rect(x,y,10,10);
	ctx.stroke();
	ctx.textAlign = "left";
	ctx.globalAlpha = chatVisibility;
	if (!player.chatting && chatVisibility > 0.01) {
		chatVisibility -= 0.01;
	}
	chatHistory.forEach(function (msg, idx) {
		ctx.fillText(msg, x, y + idx * 10);
	});
	if (player.chatting) {
		ctx.fillText(name + "> " + player.chatBuffer + "_", x, y + (chatListLength) * 10);
	}
	ctx.globalAlpha = 1;
}
function chat(message) {
	socket.send("4," + message);
	chatHistory.shift();
	chatHistory.push(name + "> " + message);
	console.log(chatHistory);
}
function addToChat(message) {
	chatVisibility = 2;
	chatHistory.shift();
	chatHistory.push(message);
}


CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r, color) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x + r, y);
	this.arcTo(x + w, y, x + w, y + h, r);
	this.arcTo(x + w, y + h, x, y + h, r);
	this.arcTo(x, y + h, x, y, r);
	this.arcTo(x, y, x + w, y, r);
	this.fillStyle = color;
	this.fill();
	this.closePath();
	return this;
}

// drawLineLength  draws a line with maximum length
// x1,y1 from
// x2,y2  line to
// maxLen the maximum length of the line. If line is shorter it will not be changed
function drawLineLength(x1, y1, x2, y2, maxLen) {
	var vx = x2 - x1; // get dist between start and end of line
	var vy = y2 - y1; // for x and y

	// use pythagoras to get line total length
	var mag = Math.sqrt(vx * vx + vy * vy);
	if (mag > maxLen) { // is the line longer than needed?

		// calculate how much to scale the line to get the correct distance
		mag = maxLen / mag;
		vx *= mag;
		vy *= mag;
	}
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x1 + vx, y1 + vy);
	ctx.stroke();
}
