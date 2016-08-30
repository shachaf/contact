/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Header = function (_React$Component) {
	  _inherits(Header, _React$Component);

	  function Header() {
	    _classCallCheck(this, Header);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).apply(this, arguments));
	  }

	  _createClass(Header, [{
	    key: "handleReveal",
	    value: function handleReveal() {
	      $handler.handleReveal();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props$game = this.props.game;
	      var _props$game$word = _props$game.word;
	      var prefix = _props$game$word.prefix;
	      var fullWord = _props$game$word.fullWord;
	      var not = _props$game$word.not;
	      var you = _props$game.you;
	      var active = _props$game.active;
	      var gameId = _props$game.gameId;

	      var suffix = null;
	      if (fullWord !== undefined) {
	        suffix = fullWord.slice(prefix.length);
	      }

	      var notArr = Object.keys(not).filter(function (w) {
	        return w.startsWith(prefix);
	      });
	      notArr.sort();

	      var gameDescription = gameId === 0 ? "Game not started" : "Game " + gameId + " " + (active ? "in progress" : "over");

	      return React.createElement(
	        "header",
	        { className: "header" },
	        React.createElement(
	          "h1",
	          null,
	          gameDescription,
	          ": ",
	          React.createElement(
	            "span",
	            { className: "prefix" },
	            prefix
	          ),
	          you.wordmaster ? React.createElement(
	            "span",
	            { className: "suffix" },
	            suffix
	          ) : null
	        ),
	        React.createElement(Users, { users: this.props.game.users }),
	        !active ? React.createElement(BeginInput, null) : null,
	        you.wordmaster && active ? React.createElement(
	          "div",
	          null,
	          "You are wordmaster!",
	          React.createElement(NotForm, { prefix: prefix }),
	          React.createElement(
	            "button",
	            { className: "revealButton", onClick: this.handleReveal },
	            "Reveal letter"
	          )
	        ) : null,
	        active ? React.createElement(
	          "span",
	          null,
	          "The word is not: ",
	          notArr.join(", ")
	        ) : null,
	        React.createElement("hr", null)
	      );
	    }
	  }]);

	  return Header;
	}(React.Component);

	var NotForm = function (_React$Component2) {
	  _inherits(NotForm, _React$Component2);

	  function NotForm(props) {
	    _classCallCheck(this, NotForm);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(NotForm).call(this, props));

	    _this2.handleChange = _this2.handleChange.bind(_this2);
	    _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
	    _this2.state = { value: "" };
	    return _this2;
	  }

	  _createClass(NotForm, [{
	    key: "handleChange",
	    value: function handleChange(e) {
	      var value = e.target.value;
	      var prefix = this.props.prefix;
	      var valid = value.match(/^[a-z]*$/);
	      var len = Math.min(value.length, prefix.length);

	      if (valid && value.slice(0, len) === prefix.slice(0, len)) {
	        this.setState({ value: value });
	      }
	    }
	  }, {
	    key: "handleSubmit",
	    value: function handleSubmit(e) {
	      e.preventDefault();
	      $handler.handleNot(this.state.value);
	      this.setState({ value: "" });
	    }
	  }, {
	    key: "submitDisabled",
	    value: function submitDisabled() {
	      var value = this.state.value;
	      var prefix = this.props.prefix;
	      var valid = value.match(/^[a-z]+$/);

	      return !(valid && value.startsWith(prefix) && value.length > prefix.length);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var prefix = this.props.prefix;

	      return React.createElement(
	        "form",
	        { className: "notForm", onSubmit: this.handleSubmit },
	        React.createElement("input", { value: this.state.value, onChange: this.handleChange,
	          placeholder: prefix }),
	        React.createElement(
	          "button",
	          { type: "submit", disabled: this.submitDisabled() },
	          "Not"
	        )
	      );
	    }
	  }]);

	  return NotForm;
	}(React.Component);

	var BeginInput = function (_React$Component3) {
	  _inherits(BeginInput, _React$Component3);

	  function BeginInput(props) {
	    _classCallCheck(this, BeginInput);

	    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(BeginInput).call(this, props));

	    _this3.handleBegin = _this3.handleBegin.bind(_this3);
	    _this3.handleChange = _this3.handleChange.bind(_this3);

	    _this3.state = { value: "" }; // TODO: do this on the other input?
	    return _this3;
	  }

	  _createClass(BeginInput, [{
	    key: "handleChange",
	    value: function handleChange(e) {
	      // TODO: validation
	      this.setState({ value: e.target.value });
	    }
	  }, {
	    key: "handleBegin",
	    value: function handleBegin(e) {
	      e.preventDefault();
	      $handler.handleBegin(this.refs.input.value);
	    }
	  }, {
	    key: "beginDisabled",
	    value: function beginDisabled() {
	      return !this.state.value.match(/^[a-z]+$/);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "form",
	        null,
	        React.createElement("input", { type: "text", ref: "input", value: this.state.value, onChange: this.handleChange }),
	        " ",
	        React.createElement(
	          "button",
	          { onClick: this.handleBegin, disabled: this.beginDisabled() },
	          "Begin game"
	        )
	      );
	    }
	  }]);

	  return BeginInput;
	}(React.Component);

	//class UsedWords extends React.Component {
	//}

	// Clues

	function showTimeInterval(t) {
	  t /= 1000;
	  var h = t / 3600 | 0;
	  t %= 3600;
	  var m = t / 60 | 0;
	  t %= 60;
	  var s = t | 0;
	  return (h ? h + "h" : "") + (m || h ? m + "m" : "") + (s + "s");
	}

	var WithdrawButton = function (_React$Component4) {
	  _inherits(WithdrawButton, _React$Component4);

	  function WithdrawButton(props) {
	    _classCallCheck(this, WithdrawButton);

	    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(WithdrawButton).call(this, props));

	    _this4.handleWithdraw = _this4.handleWithdraw.bind(_this4);
	    return _this4;
	  }

	  _createClass(WithdrawButton, [{
	    key: "handleWithdraw",
	    value: function handleWithdraw(e) {
	      e.preventDefault();
	      $handler.handleWithdraw(this.props.clueId);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "button",
	        { className: "withdrawButton", onClick: this.handleWithdraw },
	        "Withdraw"
	      );
	    }
	  }]);

	  return WithdrawButton;
	}(React.Component);

	var ClueGuess = function (_React$Component5) {
	  _inherits(ClueGuess, _React$Component5);

	  function ClueGuess() {
	    _classCallCheck(this, ClueGuess);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ClueGuess).apply(this, arguments));
	  }

	  _createClass(ClueGuess, [{
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var guess = _props.guess;
	      var you = _props.you;
	      var clueId = _props.clueId;

	      var timeDiff = Date.now() - guess.ts;
	      return React.createElement(
	        "li",
	        { className: "guess guess-" + guess.status },
	        guess.status,
	        ":",
	        " ",
	        React.createElement(
	          "span",
	          { className: "guessUser" },
	          guess.username
	        ),
	        guess.word ? React.createElement(
	          "span",
	          { className: "guessWord" },
	          " [",
	          guess.word,
	          "]"
	        ) : null,
	        guess.status === "active" && guess.username === you.username ? React.createElement(WithdrawButton, { clueId: clueId }) : null,
	        guess.status === "active" ? React.createElement(
	          "span",
	          { className: "guessTimer" },
	          "(",
	          showTimeInterval(timeDiff),
	          ")"
	        ) : null
	      );
	    }
	  }]);

	  return ClueGuess;
	}(React.Component);

	var ClueContact = function (_React$Component6) {
	  _inherits(ClueContact, _React$Component6);

	  function ClueContact(props) {
	    _classCallCheck(this, ClueContact);

	    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClueContact).call(this, props));

	    _this6.state = { value: "", sending: false };
	    _this6.handleChange = _this6.handleChange.bind(_this6);
	    _this6.handleContact = _this6.handleContact.bind(_this6);
	    return _this6;
	  }

	  _createClass(ClueContact, [{
	    key: "handleChange",
	    value: function handleChange(e) {
	      var value = e.target.value;
	      var prefix = this.props.prefix;
	      var valid = value.match(/^[a-z]*$/);
	      var len = Math.min(value.length, prefix.length);

	      if (valid && value.slice(0, len) === prefix.slice(0, len)) {
	        this.setState({ value: value });
	      }
	    }
	  }, {
	    key: "handleContact",
	    value: function handleContact(e) {
	      e.preventDefault();
	      $handler.handleContact(this.props.clueId, this.state.value);
	      this.setState({ sending: true });
	    }
	  }, {
	    key: "contactDisabled",
	    value: function contactDisabled() {
	      var value = this.state.value;
	      var prefix = this.props.prefix;
	      var valid = value.match(/^[a-z]+$/);

	      return !(valid && value.startsWith(prefix) && value.length > prefix.length) || this.state.sending;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var prefix = this.props.prefix;

	      return React.createElement(
	        "li",
	        { className: "contact" },
	        React.createElement(
	          "form",
	          { className: "contactForm", onSubmit: this.handleContact },
	          React.createElement("input", { type: "text", ref: "input", placeholder: prefix,
	            value: this.state.value, onChange: this.handleChange,
	            disabled: this.state.sending }),
	          React.createElement(
	            "button",
	            { type: "submit",
	              disabled: this.contactDisabled() },
	            "Contact"
	          )
	        )
	      );
	    }
	  }]);

	  return ClueContact;
	}(React.Component);

	var ChallengeButton = function (_React$Component7) {
	  _inherits(ChallengeButton, _React$Component7);

	  function ChallengeButton(props) {
	    _classCallCheck(this, ChallengeButton);

	    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(ChallengeButton).call(this, props));

	    _this7.handleClick = _this7.handleClick.bind(_this7);
	    return _this7;
	  }

	  _createClass(ChallengeButton, [{
	    key: "handleClick",
	    value: function handleClick() {
	      $handler.handleChallenge(this.props.clueId);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "button",
	        { className: "challengeButton",
	          onClick: this.handleClick,
	          disabled: this.props.disabled },
	        "Challenge"
	      );
	    }
	  }]);

	  return ChallengeButton;
	}(React.Component);

	var Clue = function (_React$Component8) {
	  _inherits(Clue, _React$Component8);

	  function Clue() {
	    _classCallCheck(this, Clue);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Clue).apply(this, arguments));
	  }

	  _createClass(Clue, [{
	    key: "render",
	    value: function render() {
	      var _props2 = this.props;
	      var clue = _props2.clue;
	      var prefix = _props2.prefix;
	      var you = _props2.you;

	      var timeDiff = Date.now() - clue.ts;

	      var showContact = clue.active && !you.wordmaster;
	      var activeGuesses = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = clue.guesses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var guess = _step.value;

	          if (guess.status === "active") {
	            activeGuesses++;
	            if (guess.username === you.username) {
	              showContact = false;
	            }
	          }
	        }

	        // TODO: Account for timestamp?
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var showChallenge = you.wordmaster && clue.active;
	      var challengeDisabled = activeGuesses < 2;

	      return React.createElement(
	        "li",
	        { className: "clue " + (clue.active ? "clueActive" : "clueInactive") },
	        React.createElement(
	          "span",
	          { className: "clueQuestion" },
	          clue.question
	        ),
	        React.createElement(
	          "span",
	          { className: "clueId" },
	          clue.id
	        ),
	        showChallenge ? React.createElement(ChallengeButton, { clueId: clue.id, disabled: challengeDisabled }) : null,
	        React.createElement(
	          "ul",
	          { className: "guesses" },
	          clue.guesses.map(function (guess, i) {
	            return React.createElement(ClueGuess, { key: i, guess: guess, clueId: clue.id, you: you });
	          }),
	          showContact ? React.createElement(ClueContact, { prefix: this.props.prefix, clueId: clue.id }) : null
	        )
	      );
	    }
	  }]);

	  return Clue;
	}(React.Component);

	// TODO: Make the prefix-completion input its own component.

	var ClueForm = function (_React$Component9) {
	  _inherits(ClueForm, _React$Component9);

	  function ClueForm(props) {
	    _classCallCheck(this, ClueForm);

	    var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(ClueForm).call(this, props));

	    _this9.handleSubmit = _this9.handleSubmit.bind(_this9);
	    _this9.handleChangeQuestion = _this9.handleChangeQuestion.bind(_this9);
	    _this9.handleChangeClue = _this9.handleChangeClue.bind(_this9);
	    _this9.state = { question: "", clue: "" };
	    return _this9;
	  }

	  _createClass(ClueForm, [{
	    key: "handleSubmit",
	    value: function handleSubmit(e) {
	      e.preventDefault();
	      $handler.handleClue(this.state.question, this.state.clue);
	      this.setState({ question: "", clue: "" });
	    }
	  }, {
	    key: "handleChangeQuestion",
	    value: function handleChangeQuestion(e) {
	      this.setState({ question: e.target.value });
	    }
	  }, {
	    key: "handleChangeClue",
	    value: function handleChangeClue(e) {
	      var value = e.target.value;
	      var prefix = this.props.prefix;
	      var valid = value.match(/^[a-z]*$/);
	      var len = Math.min(value.length, prefix.length);

	      if (valid && value.slice(0, len) === prefix.slice(0, len)) {
	        this.setState({ clue: value });
	      }
	    }
	  }, {
	    key: "submitDisabled",
	    value: function submitDisabled() {
	      var clue = this.state.clue;
	      var prefix = this.props.prefix;
	      var valid = clue.match(/^[a-z]+$/);
	      var question = this.state.question;

	      return !(valid && clue.startsWith(prefix) && clue.length > prefix.length && question !== "");
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var prefix = this.props.prefix;

	      return React.createElement(
	        "li",
	        null,
	        React.createElement(
	          "form",
	          { className: "clueForm", onSubmit: this.handleSubmit },
	          React.createElement(
	            "div",
	            null,
	            React.createElement(
	              "label",
	              null,
	              "Question: ",
	              React.createElement("input", { type: "text", value: this.state.question, onChange: this.handleChangeQuestion })
	            )
	          ),
	          React.createElement(
	            "div",
	            null,
	            React.createElement(
	              "label",
	              null,
	              "Clue: ",
	              React.createElement("input", { type: "text", value: this.state.clue, onChange: this.handleChangeClue, placeholder: prefix })
	            )
	          ),
	          React.createElement(
	            "div",
	            null,
	            React.createElement(
	              "button",
	              { type: "submit", disabled: this.submitDisabled() },
	              "Clue"
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return ClueForm;
	}(React.Component);

	var Clues = function (_React$Component10) {
	  _inherits(Clues, _React$Component10);

	  function Clues() {
	    _classCallCheck(this, Clues);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Clues).apply(this, arguments));
	  }

	  _createClass(Clues, [{
	    key: "render",

	    // TODO: autoscroll to top
	    value: function render() {
	      var _props3 = this.props;
	      var you = _props3.you;
	      var prefix = _props3.prefix;


	      var clues = this.props.clues.slice();
	      // TODO: Put most-recently-updated clues on top?
	      clues.sort(function (c1, c2) {
	        // Active clues on top.
	        if (c1.active < c2.active) return 1;
	        if (c1.active > c2.active) return -1;
	        // Latest id on top.
	        if (c1.id < c2.id) return 1;
	        if (c1.id > c2.id) return -1;
	        return 0;
	      });

	      return React.createElement(
	        "div",
	        { className: "clues" },
	        React.createElement(
	          "ul",
	          null,
	          !you.wordmaster ? React.createElement(ClueForm, { prefix: prefix }) : null,
	          clues.map(function (clue) {
	            return React.createElement(Clue, { key: clue.id, clue: clue, you: you, prefix: prefix });
	          })
	        )
	      );
	    }
	  }]);

	  return Clues;
	}(React.Component);

	// Chat

	function showTimestamp(ts) {
	  function pad(n) {
	    var s = '' + n;return s.length === 2 ? s : "0" + s;
	  }
	  var date = new Date(ts);
	  return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
	}

	var ChatMessage = function (_React$Component11) {
	  _inherits(ChatMessage, _React$Component11);

	  function ChatMessage() {
	    _classCallCheck(this, ChatMessage);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChatMessage).apply(this, arguments));
	  }

	  _createClass(ChatMessage, [{
	    key: "render",
	    value: function render() {
	      var msg = this.props.message;
	      var msgText = void 0;
	      if (msg.username) {
	        msgText = "[" + showTimestamp(msg.ts) + "] <" + msg.username + "> " + msg.text;
	      } else {
	        msgText = "[" + showTimestamp(msg.ts) + "] " + msg.text;
	      }
	      return React.createElement(
	        "li",
	        null,
	        msgText
	      );
	    }
	  }]);

	  return ChatMessage;
	}(React.Component);

	var ChatMessages = function (_React$Component12) {
	  _inherits(ChatMessages, _React$Component12);

	  function ChatMessages() {
	    _classCallCheck(this, ChatMessages);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChatMessages).apply(this, arguments));
	  }

	  _createClass(ChatMessages, [{
	    key: "componentWillUpdate",
	    value: function componentWillUpdate() {
	      var node = this.refs.div;
	      this.atBottom = node.scrollHeight - node.offsetHeight - node.scrollTop < 1;
	    }
	  }, {
	    key: "componentDidUpdate",
	    value: function componentDidUpdate() {
	      if (this.atBottom) {
	        var node = this.refs.div;
	        node.scrollTop = node.scrollHeight;
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var messages = this.props.messages;

	      return React.createElement(
	        "div",
	        { className: "messages", ref: "div" },
	        React.createElement(
	          "ul",
	          null,
	          messages.map(function (msg) {
	            return React.createElement(ChatMessage, { key: msg.id, message: msg });
	          })
	        )
	      );
	    }
	  }]);

	  return ChatMessages;
	}(React.Component);

	var Users = function (_React$Component13) {
	  _inherits(Users, _React$Component13);

	  function Users() {
	    _classCallCheck(this, Users);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Users).apply(this, arguments));
	  }

	  _createClass(Users, [{
	    key: "render",

	    // No energy to do this properly.
	    value: function render() {
	      var users = this.props.users.slice();
	      users.sort(function (u1, u2) {
	        if (u1.username < u2.username) return -1;
	        if (u1.username > u2.username) return 1;
	        return 0;
	      });

	      var usersStr = users.map(function (u) {
	        return (u.wordmaster ? "@" : "") + u.username;
	      }).join(", ");

	      return React.createElement(
	        "div",
	        { className: "userList" },
	        "Users: ",
	        usersStr
	      );
	    }
	  }]);

	  return Users;
	}(React.Component);

	var ChatInput = function (_React$Component14) {
	  _inherits(ChatInput, _React$Component14);

	  function ChatInput(props) {
	    _classCallCheck(this, ChatInput);

	    var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(ChatInput).call(this, props));

	    _this14.state = { value: "" };
	    _this14.handleSend = _this14.handleSend.bind(_this14);
	    _this14.handleChange = _this14.handleChange.bind(_this14);
	    return _this14;
	  }

	  _createClass(ChatInput, [{
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this.refs.input.focus();
	    }
	  }, {
	    key: "handleSend",
	    value: function handleSend(e) {
	      e.preventDefault();
	      var msg = this.refs.input.value;
	      //console.log("would have sent " + msg);
	      //window.handler.snapshot.messages.push({
	      //  id: 2,
	      //  from: "shachaf",
	      //  ts: (Date.now()) | 0,
	      //  text: msg,
	      //});
	      $handler.handleChatInput(msg);
	      this.setState({ value: "" });
	    }
	  }, {
	    key: "handleChange",
	    value: function handleChange(e) {
	      this.setState({ value: e.target.value });
	    }
	  }, {
	    key: "sendDisabled",
	    value: function sendDisabled() {
	      return this.state.value === "";
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var username = this.props.you.username;
	      return React.createElement(
	        "footer",
	        null,
	        React.createElement(
	          "form",
	          { className: "chatForm", ref: "form", onSubmit: this.handleSend },
	          React.createElement(
	            "span",
	            { className: "chatUsername" },
	            "<" + username + ">",
	            " "
	          ),
	          React.createElement("input", { type: "text", ref: "input", value: this.state.value, onChange: this.handleChange }),
	          React.createElement(
	            "button",
	            { type: "submit", disabled: this.sendDisabled() },
	            "Send"
	          )
	        )
	      );
	    }
	  }]);

	  return ChatInput;
	}(React.Component);

	var Chat = function (_React$Component15) {
	  _inherits(Chat, _React$Component15);

	  function Chat() {
	    _classCallCheck(this, Chat);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Chat).apply(this, arguments));
	  }

	  _createClass(Chat, [{
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "div",
	        { className: "chat" },
	        React.createElement(ChatMessages, { messages: this.props.messages }),
	        React.createElement(ChatInput, { you: this.props.you })
	      );
	    }
	  }]);

	  return Chat;
	}(React.Component);

	// Game

	var Game = function (_React$Component16) {
	  _inherits(Game, _React$Component16);

	  function Game() {
	    _classCallCheck(this, Game);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Game).apply(this, arguments));
	  }

	  _createClass(Game, [{
	    key: "render",
	    value: function render() {
	      var snapshot = this.props.snapshot;

	      return React.createElement(
	        "div",
	        { className: "game" },
	        React.createElement(Header, { game: snapshot.game }),
	        React.createElement(
	          "div",
	          { className: "gameBody" },
	          React.createElement(Clues, { clues: snapshot.game.clues, you: snapshot.game.you, prefix: snapshot.game.word.prefix }),
	          React.createElement(Chat, { messages: snapshot.messages, users: snapshot.game.users, you: snapshot.game.you })
	        )
	      );
	    }
	  }]);

	  return Game;
	}(React.Component);

	var sampleSnapshot = {
	  messages: [
	    //{ id: 0, ts: 1460263713, from: "shachaf", text: "hi" },
	    //{ id: 1, ts: 1460263773, from: "someone", text: "hello" },
	  ],
	  game: {
	    clues: [],
	    users: [{ username: "shachaf", wordmaster: true }, { username: "someone", wordmaster: false }],
	    you: { username: "shachaf", wordmaster: true },
	    active: false,
	    gameId: 0,
	    word: {
	      prefix: "com",
	      fullWord: "component",
	      not: { "computer": true, "commiserate": true }
	    }
	  }
	};

	// TODO: handle case everywhere

	//clues: [
	//  { id: 0,
	//    ts: 1460263713000,
	//    question: "Does it remove a horse from its stable?",
	//    guesses: [ // Should be sorted by id
	//        {id: 0, from: "someone", ts: 1460263773000},
	//        {id: 1, from: "shachaf", ts: 1460263778000, word: "destabilize"},
	//    ],
	//  },
	//  { id: 1,
	//    ts: 1460263800000,
	//    question: "Is it what this is?",
	//    guesses: [ {id: 0, user: "someone", ts: 1460263830000} ],
	//  },
	//],
	//users: {"shachaf": true, "someone": false},
	//game: {notWords: []},
	//word: {prefix: "com", fullWord: "component", not: ["computer"]},

	var Handler = function () {
	  _createClass(Handler, [{
	    key: "rerender",
	    value: function rerender() {
	      ReactDOM.render(React.createElement(Game, { snapshot: this.snapshot }), this.contentNode);
	    }
	  }, {
	    key: "handleCmd",
	    value: function handleCmd(cmd, arg) {
	      var m = void 0;
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
	            console.log("usage: /clue word question");
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
	        case "withdraw":case "wd":
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
	        case "wordmaster":case "wm":
	          this.handleWordmaster();
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
	  }, {
	    key: "handleSnapshot",
	    value: function handleSnapshot() {
	      this.sendReq({ type: "snapshot" });
	    }
	  }, {
	    key: "handleSay",
	    value: function handleSay(text) {
	      this.sendReq({ type: "say", text: text });
	    }
	  }, {
	    key: "handleReveal",
	    value: function handleReveal() {
	      this.sendReq({ type: "reveal" });
	    }
	  }, {
	    key: "handleNot",
	    value: function handleNot(word) {
	      this.sendReq({ type: "not", word: word });
	    }
	  }, {
	    key: "handleClue",
	    value: function handleClue(question, guess) {
	      this.sendReq({ type: "clue", question: question, guess: guess });
	    }
	  }, {
	    key: "handleContact",
	    value: function handleContact(clueId, word) {
	      this.sendReq({ type: "contact", clueId: clueId, word: word });
	    }
	  }, {
	    key: "handleWithdraw",
	    value: function handleWithdraw(clueId) {
	      this.sendReq({ type: "withdraw", clueId: clueId });
	    }
	  }, {
	    key: "handleChallenge",
	    value: function handleChallenge(clueId) {
	      this.sendReq({ type: "challenge", clueId: clueId });
	    }
	  }, {
	    key: "handleBegin",
	    value: function handleBegin(word) {
	      this.sendReq({ type: "begin", word: word });
	    }
	  }, {
	    key: "handleWordmaster",
	    value: function handleWordmaster() {
	      this.sendReq({ type: "wordmaster" });
	    }
	  }, {
	    key: "handleChatInput",
	    value: function handleChatInput(text) {
	      var m = text.match(/^\/([a-z]*)(?: (.*))?$/);
	      if (m) {
	        this.handleCmd(m[1], m[2] ? m[2] : "");
	      } else {
	        this.handleSay(text);
	      }
	    }
	  }, {
	    key: "sendReq",
	    value: function sendReq(req) {
	      this.ws.send(JSON.stringify(req));
	    }
	  }, {
	    key: "wsGotData",
	    value: function wsGotData(e) {
	      console.log("got " + e.data);
	      var res = JSON.parse(e.data);
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
	  }, {
	    key: "wsClosed",
	    value: function wsClosed(e) {
	      console.log("ws was closed");
	    }
	  }, {
	    key: "start",
	    value: function start() {
	      this.ws = new WebSocket(this.wsAddr);
	      this.ws.onmessage = this.wsGotData.bind(this);
	      this.ws.onclose = this.wsClosed.bind(this);

	      this.rerender();
	      setInterval(this.rerender.bind(this), 1000);
	    }
	  }]);

	  function Handler(wsAddr, contentNode) {
	    _classCallCheck(this, Handler);

	    this.wsAddr = wsAddr;
	    this.contentNode = contentNode;

	    this.snapshot = sampleSnapshot;
	  }

	  return Handler;
	}();

	var $handler;

	function main() {
	  var wsAddr = "ws://localhost:1618/game/testgame";
	  if (window.location.hash) {
	    document.cookie = "username=" + window.location.hash.slice(1);
	  }
	  $handler = new Handler(wsAddr, document.getElementById("content"));
	  window.handler = $handler;
	  $handler.start();
	}

	main();

/***/ }
/******/ ]);