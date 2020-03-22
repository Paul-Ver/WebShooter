//Global variables
const Network = require('./networking');
maxPlayers = 20;
playerList = new Array(maxPlayers).fill();

log = require('./log');
net = new Network(8001,20);
cons = require('./console');
