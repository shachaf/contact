import {User} from "./User";
import * as util from "./util";

export class Game {
  constructor() {
    this.users = new Map();
    this.messages = [];
    this.clues = new Map();
    this.notWords = {};
    this.nextMsgId = 0; // Is this necessary now?
    this.nextClueId = 0;
    this.gameId = 0; // TODO: is gameId necessary anymore?
    this.gameActive = false;
    this.fullWord = "";
    this.knownChars = 0;
    // TODO: Store wordmaster usernames across reconnections.
  }

  // Add an event to the log and send it to every user.
  // Add an argument to also propagate state?
  // username is optional
  sendMessage(text, username) {
    let obj = {
      id: this.nextMsgId++,
      ts: Date.now(),
      text: text,
    };
    if (username !== undefined) obj.username = username

    this.messages.push(obj);
    for (let user of this.users.values()) {
      user.sendResponse({type: "message", message: obj});
    }
  }

  // Is the game with this game ID over?
  isGameIdOver(gameId) {
    return !this.gameActive || gameId < this.gameId;
  }

  serializeMessages() {
    return this.messages;
  }

  serializeGame(user) {
    return {
      clues: Array.from(this.clues.values()).map(c => c.serialize(this, user)),
      users: Array.from(this.users.values()).map(u => u.serialize()),
      you: user.serialize(),
      active: this.gameActive,
      gameId: this.gameId,
      word: {
        prefix: this.currentPrefix(),
        fullWord: user.wordmaster ? this.fullWord : undefined,
        not: this.notWords,
      },
    };
  }

  begin(fullWord, wmUser) {
    for (let user of this.users.values()) {
      user.wordmaster = user === wmUser;
    }

    this.clues = new Map();
    this.notWords = {};
    // reset nextClueId?
    this.gameId++;
    this.gameActive = true;
    this.fullWord = fullWord;
    this.knownChars = 1; // Start at 1 or 0? If starting at 1, should check to see word length is >1.
    this.nextClueId = 0;

    this.sendMessage(wmUser.username + " has started a new game; prefix: " + this.currentPrefix());
  }

  refreshGame() {
    for (let user of this.users.values()) {
      user.sendGame();
    }
  }

  doReveal(allChars) {
    if (allChars) {
      this.knownChars = this.fullWord.length
    } else {
      this.knownChars++;
    }
    for (let clue of this.clues.values()) {
      clue.handlePrefixChange(this.currentPrefix());
    }
    this.checkGameOver();
  }

  // Should gameOver be implicit in knownChars === fullWord.length, rather than an explicit bool?
  checkGameOver() {
    if (this.knownChars === this.fullWord.length) {
      this.gameActive = false;
      this.sendMessage("Game over! Word: " + this.fullWord);
      // go through clues
      // todo: anything else?
    }
  }

  currentPrefix() {
    return this.fullWord.slice(0, this.knownChars);
  }

  // Move some of this logic to User.
  wsOnConnected(ws, username) {
    if (!User.validUsername(username)) {
      util.wsAbort(ws, "invalid username: " + username);
      return;
    }

    if (this.users.has(username)) {
      //throw "user exists";
      this.users.get(username).quit("user already exists");
      //this.kickUser(this.users.get(username));
      //this.users.delete(username);
      console.log("REMOVING " + username);
    }

    let user = new User(username, ws, this);
    this.users.set(username, user);

    ws.on("message", user.wsOnMessage.bind(user));
    ws.on("close", user.wsOnClose.bind(user));
    ws.on("error", user.wsOnError.bind(user));

    this.sendMessage("join: " + username);

    user.sendSnapshot();

    this.refreshGame();
  }
}
