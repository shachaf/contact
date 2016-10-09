import * as util from "./util";
import * as Clue from "./Clue";

// TODO: Move a lot of the logic back into Game.

export class User {
  static validUsername(s) {
    return !!s.match(/^[a-z0-9]+$/)
  }

  constructor(username, ws, game) {
    this.username = username;
    this.ws = ws;
    this.game = game;
    this.wordmaster = false;
  }

  // Maybe the handlers return a list of events to be propagated?
  // todo: Maybe make a User object and make all these things methods of it?
  // also: should really switch to Map etc. instead of objects
  gotReq(req) {
    const handlers = {
      "snapshot": this.sendSnapshot,
      "say": this.handleSayReq,
      "reveal": this.handleRevealReq,
      "not": this.handleNotReq,
      "clue": this.handleClueReq,
      "contact": this.handleContactReq,
      "withdraw": this.handleWithdrawReq,
      "challenge": this.handleChallengeReq,
      "begin": this.handleBeginReq,
      "wordmaster": this.handleWordmasterReq,
      "choosewm": this.handleChoosewmReq,
    };

    let handler = handlers[req.type];
    if (!handler) {
      this.warn("unknown req type: " + req.type);
      return;
    }

    let refresh = handler.call(this, req);
    if (refresh) {
      this.game.refreshGame();
    }
  }

  sendGame() {
    this.sendResponse({type: "game", game: this.game.serializeGame(this)});
  }

  quit(reason) {
    console.log("quitting " + this.username + ": " + reason);
    // todo
    try {
      ws.terminate();
    } catch(e) {}
    // ... cleanup ...
    this.game.users.delete(this.username);
    this.game.sendMessage("quit: " + this.username + " (" + reason + ")");
    this.game.refreshGame();
  }

  //kickUser(username, cb) {
  //  // Find username everywhere.
  //  let ws = this.users[username]
  //  delete this.users[username];
  //  this.propagateAction({type: "kick", username: username});

  //  ws.close();
  //}


  // Mutates msg.
  sendResponse(msg) {
    msg.ts = Date.now();
    let msgStr = JSON.stringify(msg);
    console.log("sending " + msgStr);
    try {
      this.ws.send(msgStr);
    } catch (e) {
      // todo: handle error
    }
  }

  // Requests

  serialize() {
    return {username: this.username, wordmaster: this.wordmaster};
  }

  sendSnapshot() {
    let game = this.game;
    let snapshot = {
      messages: game.serializeMessages(),
      game: game.serializeGame(this),
    };
    this.sendResponse({type: "snapshot", snapshot: snapshot});

    return false;
  }

  handleSayReq(req) {
    if (req.text === "") return this.warn(this, "empty chat message");
    this.game.sendMessage(req.text, this.username);

    return false;
  }

  handleRevealReq(req) {
    if (!this.wordmaster || !this.game.gameActive) {
      this.warn("can't reveal");
      return false;
    }

    // TODO: Reorder these?
    this.game.doReveal(false);
    this.game.sendMessage(this.username + " revealed a letter; prefix: " + this.game.currentPrefix());
    return true;
  }

  handleNotReq(req) {
    if (!this.wordmaster || !this.game.gameActive) {
      this.warn("can't not");
      return false;
    }
    let word = req.word;
    if (!word || !util.validWord(word)) {
      this.warn("invalid word" + word);
      return false;
    }
    if (!word.startsWith(this.game.currentPrefix())) {
      this.warn("not a completion: " + word);
      return false;
    }
    if (word in this.game.notWords) {
      this.warn("word already ruled out: " + word);
      return false;
    }
    if (word === this.game.fullWord) {
      this.warn("it's not not that word");
      return false;
    }

    this.game.notWords[word] = true;

    this.game.sendMessage(this.username + " ruled out " + word);

    for (let clue of this.game.clues.values()) {
      let msg = clue.defuseWith(word);
      if (msg) {
        this.game.sendMessage("Clue " + clue.id + " " + msg + "!");
      }
    }

    return true;

    //for (clue of this.clues) { // Maybe better to keep withdrawn guesses and just not display them.
    //  for (guessId in clue.guesses) {
    //    let guess = clue.guesses[guessId];
    //    if (guess.word === word) {
    //      delete clue.guesses[guessId];
    //      evts.push({type: "clue", clue: util.deepcopy(clue)});
    //    }
    //    if (Object.keys(clue.guesses).length === 0) {
    //      clue.active = false;
    //    }
    //  }
    //}

    //return evts;
  }

  handleClueReq(req) {
    if (false) {
      this.warn("you can't add a new clue!"); // todo: active clue limit for a user?
      return false;
    }
    if (this.wordmaster) {
      this.warn("wordmaster can't clue");
      return false;
    }
    const clueStr = req.clue;
    if (!clueStr) {
      this.warn("invalid clue");
      return false;
    }
    const guessWord = req.guess;
    if (!guessWord || !util.validWord(guessWord)) {
      this.warn("invalid guess");
      return false;
    }
    if (!guessWord.startsWith(this.game.currentPrefix())) {
      this.warn("not a completion: " + guessWord);
      return false;
    }
    if (guessWord in this.game.notWords) {
      this.warn("word already ruled out: " + guessWord);
      return false;
    }

    let clueId = this.game.nextClueId++;
    let clue = new Clue.Clue(clueId, clueStr);
    clue.addGuess(new Clue.Guess(this.username, guessWord));

    this.game.clues.set(clueId, clue);

    this.game.sendMessage(this.username + " added clue " + clueId + ": " + clueStr);

    return true;
  }

  handleContactReq(req) {
    if (this.wordmaster) {
      this.warn("wordmaster can't contact");
      return false;
    }
    const clueId = req.clueId;
    if (clueId === undefined) {
      this.warn("no clue id");
      return false;
    }
    let clue = this.game.clues.get(clueId);
    if (!clue) {
      this.warn("no clue");
      return false;
    }
    if (!clue.isActive()) {
      this.warn("can't contact inactive clue");
      return false;
    }

    for (const guess of clue.guesses) {
      if (guess.username === this.username &&
          guess.status === "active") {
        this.warn("you already have a guess for this clue");
        return false;
      }
    }

    let guessWord = req.word;
    if (!guessWord || !util.validWord(guessWord)) {
      this.warn("invalid guess");
      return false;
    }

    clue.addGuess(new Clue.Guess(this.username, guessWord));
    this.game.sendMessage(this.username + " contacted clue " + clue.id + ": " + clue.clue);

    return true;
  }

  handleWithdrawReq(req) {
    const clueId = req.clueId;
    if (clueId === undefined) {
      this.warn("no clue id");
      return false;
    }
    let clue = this.game.clues.get(clueId);
    if (!clue) {
      this.warn("no clue");
      return false;
    }

    let guess = clue.activeGuessFor(this.username);
    if (!guess) {
      this.warn("no active guess");
      return false;
    }

    guess.status = "withdrawn";
    this.game.sendMessage(this.username + " withdrew guess for clue " + clue.id);

    return true;
  }

  handleChallengeReq(req) {
    if (!this.wordmaster) {
      this.warn("only a wordmaster can challenge");
      return false;
    }
    const clueId = req.clueId;
    if (clueId === undefined) {
      this.warn("no clue id");
      return false;
    }
    let clue = this.game.clues.get(clueId);
    if (!clue) {
      this.warn("no clue");
      return false;
    }

    if (clue.guessesWithStatus("active").length < 2) {
      this.warn("need at least two active guesses to challenge");
      return false;
    }

    this.game.sendMessage(this.username + " challenged clue " + clue.id + ": " + clue.clue);

    let [consensusGuess, activeGuesses] = clue.challenge();
    let guessesMsg = activeGuesses.map(g => g.username + ": " + g.word).sort().join(", ");

    if (consensusGuess !== null) {
      this.game.sendMessage("Clue " + clue.id + " successful! Guesses: " + guessesMsg);
      console.log(consensusGuess, this.game.fullWord);
      this.game.doReveal(consensusGuess === this.game.fullWord);
      // Maybe: For each guessed word, not it (unless correct)?
      // People could always ask "Is it X?" immediately anyway, now that everyone has the word in mind.
      // That's probably a better way to handle the correct word, too, than a boolean argument to doReveal.
    } else {
      this.game.sendMessage("Clue " + clue.id + " failed! Guesses: " + guessesMsg);
    }

    return true;
  }

  handleBeginReq(req) {
    if (this.game.gameActive) {
      this.warn("a game is already in progress");
      return false;
    }
    let fullWord = req.word;
    if (!fullWord || !util.validWord(fullWord)) {
      this.warn("invalid word: " + fullWord);
      return false;
    }

    this.game.begin(fullWord, this);
    return true;
  }

  handleWordmasterReq(req) {
    if (!this.game.gameActive) {
      this.warn("no game in progress");
      return false;
    }
    if (this.wordmaster) {
      this.warn("you are already wordmaster");
      return false;
    }

    for (let clue of this.game.clues.values()) {
      clue.withdrawUser(this.username);
    }

    this.wordmaster = true;
    this.game.sendMessage(this.username + " is now a wordmaster");

    return true;
  }

  handleChoosewmReq(req) {
    if (this.game.gameActive) {
      this.warn("game is in progress");
      return false;
    }
    let users = Array.from(this.game.users.values());
    let chosenUser = users[Math.floor(Math.random() * users.length)];
    this.game.sendMessage(this.username + " chose a random user: " + chosenUser.username);
    return false;
  }

  // end requests

  wsOnMessage(data) {
    console.log("request: " + data);
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (ex) {
      util.wsWarn(this.ws, "invalid message from " + this.username + ": ", e.data);
      return;
    }

    this.gotReq(msg);
  }

  wsOnClose(code, message) {
    this.quit("closed connection");
  }

  wsOnError(error) {
    this.quit("error");
  }

  warn(msg) {
    util.wsWarn(this.ws, this.username + ": " + msg);
  }
}
