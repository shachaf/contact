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
}

export class Clue {
  constructor(id, clue) {
    this.id = id;
    this.ts = Date.now();
    this.active = true;
    this.clue = clue;
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
    let consensusGuess = null;
    for (let guess of activeGuesses) {
      let numGuessesMatchingWord = activeGuesses.filter(g => g.word === guess.word).length;
      if (numGuessesMatchingWord * 2 > activeGuesses.length) {
        consensusGuess = guess.word;
      }
      guess.status = "challenged";
    }
    return [consensusGuess, activeGuesses];
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
      clue: this.clue,
      guesses: this.guesses.map(g => g.serialize(game, user)),
    };
  }

}
