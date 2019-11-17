//TODO join/leave messages (with player id))
//TODO chat
//TODO server authorization

//Global variables
log = require('./log');
maxPlayers = 20;
playerList = new Array(maxPlayers).fill();

map = require('../client/maps/testmap');

require('./networking');
require('./console');

