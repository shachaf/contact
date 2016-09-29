"use strict";

import {User} from "./User";
import {Game} from "./Game";
import {wsAbort, wsWarn} from "./util";
import * as cookie from "cookie";


const PORT = 1618;


import * as path from "path";

let express = require("express");
let app = express();
let ws = new require("ws");
let server = require("http").createServer(app);
app.use("/", express.static(__dirname + "/../../static"));

app.get("/game/:gamename", function (req, res) {
  res.sendFile(path.resolve(__dirname + "/../../static/game.html"));
});

let $games = new Map();

//let testgame = new Game();
//$games.set("testgame", testgame);


/*
testgame.gameActive = true;
testgame.gameId = 1;
testgame.fullWord = "abcd";
testgame.knownChars = 1;
import * as Clue from "./Clue";
let clueId = testgame.nextClueId++;
let clue = new Clue.Clue(clueId, "Is it this?");
clue.addGuess(new Clue.Guess("shachaf", "clue"));
clue.addGuess(new Clue.Guess("someone", "clumsy"));
clue.addGuess(new Clue.Guess("myself", "cute"));
testgame.clues.set(clueId, clue);
// */

app.get("/games", function(req, res) {
  let gameUsers = {};
  for (let [name, game] of $games.entries()) {
    gameUsers[name] = Array.from(game.users.values()).map(u => u.username);
  }
  res.json(gameUsers);
});

let wss = new ws.Server({server: server});
wss.on("connection", function(ws) {
  const path = ws.upgradeReq.url;
  const m = path.match(/^\/game\/([a-z]+)$/);
  if (m === null) {
    wsAbort(ws, "invalid path");
    return;
  }
  const gameName = m[1];
  let game = $games.get(gameName);
  if (game === undefined) {
    //wsAbort(ws, "game " + gameName + " does not exist");
    //return;
    game = new Game();
    $games.set(gameName, game);
  }

  let username;

  let cookieStr = ws.upgradeReq.headers.cookie;
  if (cookieStr !== undefined) {
    username = cookie.parse(cookieStr)["username"];
  }

  if (!username) {
    wsAbort(ws, "no username");
    return;
  }

  game.wsOnConnected(ws, username);
});

server.listen(PORT);
