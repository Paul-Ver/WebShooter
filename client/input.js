//Keyboard controls
//Gives a list of keys that are pressed
//And a "keysChanged" variable to check.
var keysDown = {};
var keysChanged = false;
addEventListener("keydown", function (e) {
	if(!keysDown[e.keyCode]){
		keysDown[e.keyCode] = true;
		keysChanged = true;
		//console.log(keysDown);
	}
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
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
	mouseMoved = true;
}
	//Mouse down
document.addEventListener("mousedown", function(evt) {
	mouseDown.push(evt.which);
	mouseButtonChanged = true;
	console.log("Mouse pressed!");
});
	//Mouse up
document.addEventListener("mouseup", function(evt) {		
	mouseDown.splice(mouseDown.indexOf(evt.which));
	mouseButtonChanged = true;;
});
	//Mouse wheel
document.addEventListener("mousewheel", MouseWheelHandler, false);		// "Regular browsers"
document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);	// Firefox
function MouseWheelHandler(e) {// cross-browser wheel delta (https://www.sitepoint.com/html5-javascript-mouse-wheel/)
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	console.log("Mouse wheel change: " + delta);
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