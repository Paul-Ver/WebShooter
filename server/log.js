module.exports = function log() {
	// 1. Convert args to a normal array
	var args = Array.prototype.slice.call(arguments);
	// 2. Prepend log prefix log string
	args.unshift(new Date().toISOString() + " :");
	// 3. Pass along arguments to console.log
	console.log.apply(console, args);
}