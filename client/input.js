//Saving keybindings. Uses localstorage, reverts to default if localstorage is not available.
var originalKeys = {};
originalKeys.up = "87";
originalKeys.down = "83";
originalKeys.left = "65";
originalKeys.right = "68";
originalKeys.chat = "13";
originalKeys.backspace = "8";
var customKeys = originalKeys;
if (typeof(Storage) !== "undefined") {
	if(localStorage.getItem("customkeys")){
		customKeys = JSON.parse(localStorage.getItem("customkeys"));
		console.log("Received custom keybindings", customKeys);
	}
} else {
    console.log("Your browser does not support local storage, key mappings will NOT be saved!");
}
function saveCustomKeys(){
	localStorage.setItem("customkeys",JSON.stringify(customKeys));
}
function restoreCustomKeys(){
	localStorage.setItem("customkeys",JSON.stringify(originalKeys));
	customKeys = originalKeys;
}

//Keyboard controls
//Gives a list of keys that are pressed
//And a "keysChanged" variable to check.
var keysDown = {};
var keysChanged = false;
addEventListener("keydown", function (e) {
	if(!keysDown[e.keyCode]){
		keysDown[e.keyCode] = true;
		keysChanged = true;
		log(10,"keydown" + JSON.stringify(keysDown));
	}
}, false);
addEventListener("keypress", function (e) {
	keysDown[-1] = String.fromCharCode(e.which);
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	log(10,"keyup" + JSON.stringify(keysDown));
	keysChanged = true;
}, false);

//Mouse controls// Handle mouse events
var mouseX=0;
var mouseY=0;
var mouseMoved = false;
var mouseDown = [];
var mouseButtonChanged = false;
var mouseScrolled = false;
var mouseScrollDelta = 0;

//Mouse move
document.onmousemove = function(mouse){
	mouseX = mouse.clientX - document.getElementById('game').getBoundingClientRect().left;
	mouseY = mouse.clientY - document.getElementById('game').getBoundingClientRect().top;
	log(11,"mousemove x:" + mouseX + " y:" + mouseY);
	mouseMoved = true;
}
//Mouse down
document.addEventListener("mousedown", function(evt) {
	mouseDown.push(evt.which);
	mouseButtonChanged = true;
	log(10,"mousedown " + evt.which);
	stopEvent(evt);
});
//Mouse up
document.addEventListener("mouseup", function(evt) {		
	mouseDown.splice(mouseDown.indexOf(evt.which));
	mouseButtonChanged = true;
	log(10,"mouseup " + evt.which);
});
//Mouse wheel
document.addEventListener("mousewheel", MouseWheelHandler, false);		// "Regular browsers"
document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);	// Firefox
function MouseWheelHandler(e) {// cross-browser wheel delta (https://www.sitepoint.com/html5-javascript-mouse-wheel/)
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	log(10,"Mouse wheel change: " + delta);
	mouseScrolled=true;
	mouseScrollDelta=delta;
}
//Right click
document.oncontextmenu = function(e){
	stopEvent(e);
}
//Prevent right click
function stopEvent(event){
	if(event.preventDefault != undefined)
		event.preventDefault();
	if(event.stopPropagation != undefined)
		event.stopPropagation();
}