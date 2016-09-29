// An <input type="text"> with a prefix. Also validates that input is a word.
class PrefixedInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const newValue = e.target.value;
    const prefix = this.props.prefix;
    const valid = newValue.match(/^[a-z]*$/);
    const len = Math.min(newValue.length, prefix.length);

    if (valid && newValue.slice(0, len) === prefix.slice(0, len)) {
      this.props.onChange(newValue);
    }
  }

  render() {
    return (
        <input value={this.props.value}
               onChange={this.handleChange}
               placeholder={this.props.prefix} />
    );
  }
}

class Header extends React.Component {
  handleReveal() {
    $handler.handleReveal();
  }

  render() {
    const {word: {prefix, fullWord, not}, you, active, gameId} = this.props.game;
    let suffix = null;
    if (fullWord !== undefined) {
      suffix = fullWord.slice(prefix.length);
    }

    const notArr = Object.keys(not).filter(w => w.startsWith(prefix));
    notArr.sort();

    let gameDescription =
      gameId === 0 ?
      "Game not started" :
      "Game " + gameId + " " + (active ? "in progress" : "over");

    return (
      <header className="header">
        <div className="headerContents">
          <h1>
          {gameDescription}: <span className="prefix">{prefix}</span>
          {you.wordmaster
            ? <span className="suffix">{suffix}</span>
            : null}
          </h1>
          <Users users={this.props.game.users} />
          {!active ? <BeginInput /> : null}
          {you.wordmaster && active
            ? <div>
                You are wordmaster!
                <NotForm prefix={prefix} />
                <button className="revealButton" onClick={this.handleReveal}>Reveal letter</button>
              </div>
            : null}
          {active
            ? <span>The word is not: {notArr.join(", ")}</span>
            : null}
        </div>
      </header>
    );
  }
}

class NotForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {value: ""};
  }

  handleChange(newValue) {
      this.setState({value: newValue});
  }

  handleSubmit(e) {
    e.preventDefault();
    $handler.handleNot(this.state.value);
    this.setState({value: ""});
  }

  submitDisabled() {
    const value = this.state.value;
    const prefix = this.props.prefix;
    const valid = value.match(/^[a-z]+$/);

    return !valid || !value.startsWith(prefix);
  }

  render() {
    const {prefix} = this.props;
    return (
      <form className="notForm" onSubmit={this.handleSubmit}>
        <PrefixedInput value={this.state.value} onChange={this.handleChange} prefix={prefix} />
        <button type="submit" disabled={this.submitDisabled()}>Not</button>
      </form>
    );
  }
}

class BeginInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleBegin = this.handleBegin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChoosewm = this.handleChoosewm.bind(this);

    this.state = {value: ""};
  }

  handleChange(e) {
    const newValue = e.target.value;
    if (newValue.match(/^[a-z]*$/)) {
      this.setState({value: newValue});
    }
  }

  handleBegin(e) {
    e.preventDefault();
    $handler.handleBegin(this.refs.input.value);
  }

  handleChoosewm(e) {
    e.preventDefault();
    $handler.handleChoosewm();
  }

  beginDisabled() {
    return !this.state.value.match(/^[a-z]+$/);
  }

  render() {
    return (
      <form>
        <input type="text" ref="input" value={this.state.value} onChange={this.handleChange} />{" "}
        <button onClick={this.handleBegin} disabled={this.beginDisabled()}>Begin game</button>
        <button onClick={this.handleChoosewm}>Choose WM</button>
      </form>
    );
  }
}

//class UsedWords extends React.Component {
//}

// Clues

function showTimeInterval(t) {
  t /= 1000;
  const h = (t / 3600) | 0;
  t %= 3600;
  const m = (t / 60) | 0;
  t %= 60;
  const s = t | 0;
  return (
    (h ? h + "h" : "") +
    (m || h ? m + "m" : "") +
    (s + "s")
  );
}

class WithdrawButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  handleWithdraw(e) {
    e.preventDefault();
    $handler.handleWithdraw(this.props.clueId);
  }

  render() {
    return (
        <button className="withdrawButton" onClick={this.handleWithdraw}>
          Withdraw
        </button>
    );
  }
}

class ClueGuess extends React.Component {
  render() {
    const {guess, you, clueId} = this.props;
    const timeDiff = Date.now() - guess.ts;
    return (
      <li className={"guess guess-" + guess.status}>
        <span className="guessUser">{guess.username}</span>
        {guess.word
          ? <span className="guessWord"> [{guess.word}]</span>
          : null}
        <span className="guessStatus"> ({guess.status})</span>
        {guess.status === "active" && guess.username === you.username
          ? <WithdrawButton clueId={clueId} />
          : null}
        {guess.status === "active"
          ? <span className="guessTimer">({showTimeInterval(timeDiff)})</span>
          : null}
      </li>
    );
  }
}

class ClueContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", sending: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleContact = this.handleContact.bind(this);
  }

  handleChange(newValue) {
    this.setState({value: newValue});
  }

  handleContact(e) {
    e.preventDefault();
    $handler.handleContact(this.props.clueId, this.state.value);
    this.setState({sending: true});
  }

  contactDisabled() {
    const value = this.state.value;
    const prefix = this.props.prefix;
    const valid = value.match(/^[a-z]+$/);

    return !valid || !value.startsWith(prefix);
  }

  render() {
    const {prefix} = this.props;
    return (
      <li className="contact">
        <form className="contactForm" onSubmit={this.handleContact}>
          <PrefixedInput prefix={prefix} value={this.state.value} onChange={this.handleChange} />
          <button type="submit" disabled={this.contactDisabled()}>
            Contact
          </button>
        </form>
      </li>);
  }
}

class ChallengeButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    $handler.handleChallenge(this.props.clueId);
  }

  render() {
    return (
      <button className="challengeButton"
              onClick={this.handleClick}
              disabled={this.props.disabled}>
        Challenge
      </button>
    );
  }
}

class Clue extends React.Component {
  render() {
    const {clue, prefix, you} = this.props;
    const timeDiff = Date.now() - clue.ts;

    let showContact = clue.active && !you.wordmaster;
    let activeGuesses = 0;
    for (let guess of clue.guesses) {
      if (guess.status === "active") {
        activeGuesses++;
        if (guess.username === you.username) {
          showContact = false;
        }
      }
    }

    // TODO: Account for timestamp?
    let showChallenge = you.wordmaster && clue.active;
    let challengeDisabled = activeGuesses < 2;

    return (
      <li className={"clue " + (clue.active ? "clueActive" : "clueInactive")}>
        <span className="clueClue">{clue.clue}</span>
        <span className="clueId">{clue.id}</span>
        {showChallenge
          ? <ChallengeButton clueId={clue.id} disabled={challengeDisabled} />
          : null }
        <ul className="guesses">
          {clue.guesses.map((guess, i) =>
            <ClueGuess key={i} guess={guess} clueId={clue.id} you={you} />
          )}
          { showContact
            ? <ClueContact prefix={this.props.prefix} clueId={clue.id} />
            : null }
        </ul>
      </li>
    );
  }
}

class ClueForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeClue = this.handleChangeClue.bind(this);
    this.handleChangeGuess = this.handleChangeGuess.bind(this);
    this.state = {clue: "", guess: ""};
  }

  handleSubmit(e) {
    e.preventDefault();
    $handler.handleClue(this.state.clue, this.state.guess);
    this.setState({clue: "", guess: ""});
  }

  handleChangeClue(e) {
    this.setState({clue: e.target.value});
  }

  handleChangeGuess(newValue) {
    this.setState({guess: newValue});
  }

  submitDisabled() {
    const guess = this.state.guess;
    const prefix = this.props.prefix;
    const guessValid = guess.match(/^[a-z]+$/);
    const clue = this.state.clue;

    return !guessValid || !guess.startsWith(prefix) || clue === "";
  }

  render() {
    const {prefix} = this.props;
    return (
      <li>
        <form className="clueForm" onSubmit={this.handleSubmit}>
          <div><label>Clue: <input type="text" value={this.state.clue} onChange={this.handleChangeClue}/></label></div>
          <div><label>Guess: <PrefixedInput prefix={prefix} value={this.state.guess} onChange={this.handleChangeGuess} /></label></div>
          <div><button type="submit" disabled={this.submitDisabled()}>Clue</button></div>
        </form>
      </li>
    );
  }
}

class Clues extends React.Component {
  // TODO: autoscroll to top?
  render() {
    const {clues, active, you, word: {prefix}} = this.props.game;

    let sortedClues = clues.slice();
    // TODO: Put most-recently-updated clues on top?
    sortedClues.sort(function(c1,c2) {
      // Active clues on top.
      if (c1.active < c2.active) return 1;
      if (c1.active > c2.active) return -1;
      // Latest id on top.
      if (c1.id < c2.id) return 1;
      if (c1.id > c2.id) return -1;
      return 0;
    });

    return (
      <div className="clues">
        <ul>
          { !you.wordmaster && active
            ? <ClueForm prefix={prefix} />
            : null }
          {sortedClues.map(clue =>
            <Clue key={clue.id} clue={clue} you={you} prefix={prefix} />
          )}
        </ul>
      </div>
    );
  }
}

// Chat

function showTimestamp(ts) {
  function pad(n) { let s = '' + n; return s.length === 2 ? s : "0" + s; }
  const date = new Date(ts);
  return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

class ChatMessage extends React.Component {
  render() {
    const msg = this.props.message;
    let msgText, className;
    if (msg.username) {
      msgText = "[" + showTimestamp(msg.ts) + "] <" + msg.username + "> " + msg.text;
      className = "userMessage";
    } else {
      msgText = "[" + showTimestamp(msg.ts) + "] " + msg.text;
      className = "systemMessage";
    }
    return (
      <li className={className}>{msgText}</li>
    );
  }
}

class ChatMessages extends React.Component {
  componentWillMount() {
    this.scrollToBottom = true;
  }

  componentWillUpdate() {
    const node = this.refs.div;
    this.scrollToBottom = node.scrollHeight - node.offsetHeight - node.scrollTop < 10;
  }

  componentDidUpdate() {
    if (this.scrollToBottom) {
      const node = this.refs.div;
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const messages = this.props.messages;

    return (
      <div className="messages" ref="div">
        <ul>
          {messages.map(msg =>
            <ChatMessage key={msg.id} message={msg} />
          )}
        </ul>
      </div>
    );
  }
}

class Users extends React.Component {
  // No energy to do this properly.
  render() {
    let users = this.props.users.slice();
    users.sort(function (u1, u2) {
      if (u1.username < u2.username) return -1;
      if (u1.username > u2.username) return 1;
      return 0;
    });

    let usersStr = users.map(u => (u.wordmaster ? "@" : "") + u.username).join(", ");

    return (
      <div className="userList">Users: <span>{usersStr}</span></div>
    );
  }
}

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ""};
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.refs.input.focus();
  }

  handleSend(e) {
    e.preventDefault();
    let msg = this.refs.input.value;
    $handler.handleChatInput(msg);
    this.setState({value: ""});
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  sendDisabled() {
    return this.state.value === "";
  }


  render() {
    const username = this.props.you.username;
    return (
      <footer>
        <form className="chatForm" ref="form" onSubmit={this.handleSend}>
          <span className="chatUsername">{"<" + username + ">"} </span>
          <input type="text" ref="input" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" disabled={this.sendDisabled()}>Send</button>
        </form>
      </footer>
    );
  }
}

class Chat extends React.Component {
  render() {
    return (
      <div className="chat">
        <ChatMessages messages={this.props.messages} />
        <ChatInput you={this.props.you} />
      </div>
    );
  }
}

// Game

class Game extends React.Component {
  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className="game">
        <Header game={snapshot.game} />
        <div className="gameBody">
          <Clues game={snapshot.game} />
          <Chat messages={snapshot.messages} users={snapshot.game.users} you={snapshot.game.you} />
        </div>
      </div>
    );
  }
}

//let sampleSnapshot = {
//  messages: [
//    //{ id: 0, ts: 1460263713, from: "shachaf", text: "hi" },
//    //{ id: 1, ts: 1460263773, from: "someone", text: "hello" },
//  ],
//  game: {
//    clues: [],
//    users: [{username: "shachaf", wordmaster: true}, {username: "someone", wordmaster: false}],
//    you: {username: "shachaf", wordmaster: true},
//    active: false,
//    gameId: 0,
//    word: {
//      prefix: "com",
//      fullWord: "component",
//      not: {"computer": true, "commiserate": true},
//    },
//  },
//  //clues: [
//  //  { id: 0,
//  //    ts: 1460263713000,
//  //    clue: "Does it remove a horse from its stable?",
//  //    guesses: [ // Should be sorted by id
//  //        {id: 0, from: "someone", ts: 1460263773000},
//  //        {id: 1, from: "shachaf", ts: 1460263778000, word: "destabilize"},
//  //    ],
//  //  },
//  //  { id: 1,
//  //    ts: 1460263800000,
//  //    clue: "Is it what this is?",
//  //    guesses: [ {id: 0, user: "someone", ts: 1460263830000} ],
//  //  },
//  //],
//  //users: {"shachaf": true, "someone": false},
//  //game: {notWords: []},
//  //word: {prefix: "com", fullWord: "component", not: ["computer"]},
//};

let initialSnapshot = {
  messages: [],
  game: {
    clues: [],
    users: [],
    you: {username: "undefined", wordmaster: false},
    active: false,
    gameId: 0,
    word: {
      prefix: "",
      not: {},
    },
  },
};

// TODO: handle case everywhere

class Handler {
  rerender() {
    ReactDOM.render(<Game snapshot={this.snapshot} />, this.contentNode);
  }

  handleCmd(cmd, arg) {
    let m;
    switch (cmd) {
      case "":
        this.handleSay(arg);
        break;
      case "snapshot":
        this.handleSnapshot();
        break;
      case "clue":
        m = arg.match(/^([a-z]+) (.+)$/);
        if (!m) {
          console.log("usage: /clue guess clue");
          break;
        }
        this.handleClue(m[2], m[1]);
        break;
      case "reveal":
        this.handleReveal();
        break;
      case "not":
        m = arg.match(/^([a-z]+)/);
        if (!m) {
          console.log("usage: /not word");
          break;
        }
        this.handleNot(m[1]);
        break;
      case "contact":
        m = arg.match(/^(\d+) ([a-z]+)$/);
        if (!m) {
          console.log("usage: /contact clueid word");
          break;
        }
        this.handleContact(parseInt(m[1]), m[2]);
        break;
      case "withdraw": case "wd":
        m = arg.match(/^(\d+)$/);
        if (!m) {
          console.log("usage: /withdraw clueid");
          break;
        }
        this.handleWithdraw(parseInt(m[1]));
        break;
      case "challenge":
        m = arg.match(/^(\d+)$/);
        if (!m) {
          console.log("usage: /challenge clueid");
          break;
        }
        this.handleChallenge(parseInt(m[1]));
        break;
      case "wordmaster": case "wm":
        this.handleWordmaster();
        break;
      case "choosewm":
        this.handleChoosewm();
        break;
      case "begin":
        m = arg.match(/^[a-z]+$/);
        if (!m) {
          console.log("invalid word");
          break;
        }
        this.handleBegin(arg);
        break;
      default:
        console.log("invalid command: " + cmd);
        return null;
        break;
    }
  }

  handleSnapshot() {
    this.sendReq({type: "snapshot"});
  }

  handleSay(text) {
    this.sendReq({type: "say", text: text});
  }

  handleReveal() {
    this.sendReq({type: "reveal"});
  }

  handleNot(word) {
    this.sendReq({type: "not", word: word});
  }

  handleClue(clue, guess) {
    this.sendReq({type: "clue", clue: clue, guess: guess});
  }

  handleContact(clueId, word) {
    this.sendReq({type: "contact", clueId: clueId, word: word});
  }

  handleWithdraw(clueId) {
    this.sendReq({type: "withdraw", clueId: clueId});
  }

  handleChallenge(clueId) {
    this.sendReq({type: "challenge", clueId: clueId});
  }

  handleBegin(word) {
    this.sendReq({type: "begin", word: word});
  }

  handleWordmaster() {
    this.sendReq({type: "wordmaster"});
  }

  handleChoosewm() {
    this.sendReq({type: "choosewm"});
  }

  handleChatInput(text) {
    let m = text.match(/^\/([a-z]*)(?: (.*))?$/);
    if (m) {
      this.handleCmd(m[1], m[2] ? m[2] : "");
    } else {
      this.handleSay(text);
    }
  }

  sendReq(req) {
    this.ws.send(JSON.stringify(req));
  }

  wsGotData(e) {
    console.log("got " + e.data);
    let res = JSON.parse(e.data);
    switch (res.type) {
      case "error":
        console.log("error: " + res.error);
        break;
      case "snapshot":
        this.snapshot = res.snapshot;
        break;
      case "game":
        this.snapshot.game = res.game;
        break;
      case "message":
        this.snapshot.messages.push(res.message);
        //if (res.event.type === "chat") {
        //  let evt = res.event;
        //  let msg = {id: evt.id, ts: evt.ts, from: evt.username, text: evt.text};
        //  this.snapshot.messages.push(msg);
        //  console.log(msg);
        //} else {
        //  let evt = res.event;
        //  let x = evt.type === "clue" ? evt.clue : evt;
        //  let msg = {id: evt.id, ts: evt.ts, from: evt.username, text: JSON.stringify(x)};
        //  this.snapshot.messages.push(msg);
        //}
        break;
      default:
        console.log("invalid res: ", e.data);
        break;
    }
    this.rerender();
  }

  wsClosed(e) {
    console.log("ws was closed");
  }

  start() {
    this.ws = new WebSocket(this.wsAddr);
    this.ws.onmessage = this.wsGotData.bind(this);
    this.ws.onclose = this.wsClosed.bind(this);

    this.rerender();
    setInterval(this.rerender.bind(this), 1000);
  }

  constructor(wsAddr, contentNode) {
    this.wsAddr = wsAddr;
    this.contentNode = contentNode;

    this.snapshot = initialSnapshot;
  }
}

var $handler;

function main() {
  let m = location.pathname.match(/^\/game\/([a-z]+)/);
  if (!m) {
    console.log("no game name");
    return;
  }
  let gameName = m[1];

  const wsAddr = "ws://" + location.host + "/game/" + gameName;
  if (window.location.search) {
    document.cookie = "username=" + window.location.search.slice(1) + "; path=/";
  }

  if (!document.cookie.match(/\busername=[a-z]+\b/)) {
    location.href = "/";
    return;
  }

  $handler = new Handler(wsAddr, document.getElementById("content"));
  window.handler = $handler;
  $handler.start();
}

main();
