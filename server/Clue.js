export class Guess {
  constructor(username, word) {
    this.ts = Date.now();
    this.status = "active";
    this.username = username;
    this.word = word;
  }

  serialize(game, user) {
    let obj = {
      ts: this.ts,
      status: this.status,
      username: this.username,
    };
    if (user.username === this.username ||
        !game.gameActive ||
        this.status === "defused" ||
        this.status === "challenged") {
      obj.word = this.word;
    }
    return obj;
  }

  //censored(user, game, gameId) {
  //  let obj = {ts: this.ts, active: this.active, username: this.username};
  //  if (user.username === this.username ||
  //      game.isGameIdOver(gameId) ||
  //      game.safeToReveal(this.word)) {
  //    obj.word = this.word;
  //  }
  //  return obj;
  //}
}

export class Clue {
  constructor(id, question) {
    this.id = id;
    this.ts = Date.now();
    this.active = true;
    this.question = question;
    this.guesses = [];
  }

  // necessary?
  addGuess(guess) {
    this.guesses.push(guess); // todo
  }

  withdrawUser(username) {
    let g = this.activeGuessFor(username);
    if (g) {
      g.status = "withdrawn";
    }
  }

  defuseWith(word) {
    const wasActive = this.isActive();

    let partiallyDefused = false;

    for (let g of this.guesses) {
      const oldStatus = g.status;
      if (g.word === word &&
          (g.status === "active" || g.status === "withdrawn"))
        g.status = "defused";
      if (g.status === "defused" && oldStatus === "active")
        partiallyDefused = true;
    }

    if (!this.isActive() && wasActive) return "defused";
    if (partiallyDefused) return "partially defused";
    return null;
  }

  // TODO: When you reveal a letter, guesses that are no longer valid should
  // probably be visible to everyone, rather than marked withdrawn and only
  // visible at the end of the game.
  handlePrefixChange(newPrefix) {
    for (let guess of this.guesses) {
      if (guess.status === "active" &&
          !guess.word.startsWith(newPrefix)) {
        guess.status = "withdrawn";
      }
    }
  }

  challenge() {
    let activeGuesses = this.guessesWithStatus("active");
    let clueSuccessful = false;
    for (let guess of activeGuesses) {
      let numGuessesMatchingWord = activeGuesses.filter(g => g.word === guess.word).length;
      if (numGuessesMatchingWord * 2 > activeGuesses.length) {
        clueSuccessful = true;
      }
      guess.status = "challenged";
    }
    return clueSuccessful;
  }

  guessesWithStatus(status) {
    return this.guesses.filter(g => g.status === status);
  }

  // A clue is active if it has any active guesses.
  isActive() {
    for (let g of this.guesses) {
      if (g.status === "active") {
        return true;
      }
    }
    return false;
  }

  // Return the active guess for a user, if any (there can be at most one).
  activeGuessFor(username) {
    for (let g of this.guesses) {
      if (g.username === username &&
          g.status === "active") {
        return g;
      }
    }

    return null;
  }

  serialize(game, user) {
    return {
      id: this.id,
      ts: this.ts,
      active: this.isActive(),
      question: this.question,
      guesses: this.guesses.map(g => g.serialize(game, user)),
    };
  }

  //censored(user, game) {
  //  let obj = {id: this.id, gameId: this.gameId, ts: this.ts,
  //    active: this.active, question: this.question,
  //    guesses: this.guesses.map(g => g.censored(user, game, this.gameId))};
  //}
}

/*
  // Return a censored copy of an event.
  // After a game ends, everyone will be able to see all events. But the way
  // this is written, they'll only see them if they get a new snapshot.
  censoredEvent(user, evt) {
    let copy = util.deepcopy(evt);
    if (evt.gameId === this.gameId) return copy;
    switch (evt.type) {
      case "chat": case "quit": case "not": case "reveal":
        break;
      case "contact":
        for (guess of copy.guesses) {
          if (guess.from !== user.username) {
            delete guess.word;
          }
        }
        break;
      case "begin":
        if (!user.wordmaster) {
          delete evt.word;
        }
        break;
      default:
        throw "invalid event " + JSON.stringify(evt);
        break;
    }
    return copy;
  }
*/
