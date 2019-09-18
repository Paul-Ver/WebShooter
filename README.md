# WebShooter

HTML5 Top Down Shooter - HTTPS/WSS (Secured)

To play the game, you can simply join it on https://www.fuaze.nl/game/

Based on tutorials by RainingChain
Inspired by Uniqc "Afterwars" (Gamemaker game)

![alt text](https://github.com/Paul-Ver/WebShooter/blob/master/preview.gif "Example screenshot.")

Features:

- Ingame-chat
- Low level websocket connections
- Comma separated protocol for fast communication (less bandwith as JSON)
- HTTPS/WSS Secured
- Console commands for server
- Private server

# Installing & Running:

The instructions below are for those who like to contribute on this game development, or to run your own (modded) server.

Install NodeJS & NPM (https://nodejs.org/en/download/)

Optional:
Install Git (https://git-scm.com/)
Install Google Chrome (better profiling/debugging)
Install nodemon (automatic restart server on filechanges)

git clone https://github.com/Paul-Ver/WebShooter.git

Run the game server with from command prompt/terminal: 
npm install
node main.js (from server installation directory)

If you make any changes to the server/client, please consider sending a pull request.

# TODO:

- Fix issue with other player rotation following player's mouse movement.
- Fix issue with player moving faster at higher refresh rate.
- Feat weapons.
- Feat traversible map.
- Feat gamemodes/score.
- Feat sound.
- Public server / matchmaking server.

# Please contribute!

If you think this project is interesting, please support it by contributing.
You should help develop this project, rather than create your own rip-off ;)
The reasoning behind this is that we will all benefit from having "one good source" instead of having multiple "half finished" projects.