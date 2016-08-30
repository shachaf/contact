class GameListEntry extends React.Component {
  render() {
    const {name, users, active} = this.props;
    let sortedUsers = users.slice();
    sortedUsers.sort();

    return (
      <li>
        { active
          ? <a href={"/game/" + name}>{name}</a>
          : <span>{name}</span> }
        : {sortedUsers.join(", ")}
      </li>
    );
  }
}

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.props.onUsernameChange(e.target.value);
  }

  handleRefresh(e) {
    e.preventDefault();
    $handler.getGames();
  }

  componentDidMount() {
    this.refs.usernameInput.focus();
  }

  render() {
    const {gameUsers, username} = this.props;
    let gameNames = Object.keys(this.props.gameUsers);
    gameNames.sort();

    return (
      <div>
        <p>Your username is: <input ref="usernameInput" type="text" value={username || ""} onChange={this.handleChange} /></p>
        <div>
          Games in progress: <button onClick={this.handleRefresh}>Refresh</button>
          <ul>
            {gameNames.map(name =>
              <GameListEntry
                key={name} name={name}
                users={gameUsers[name]}
                active={username !== null} />
            )}
          </ul>
        </div>
      </div>
    );
  }
}

class Handler {
  constructor(contentNode) {
    this.contentNode = contentNode;
    this.gameUsers = {};
    this.xhr = null;

    this.changeUsername = this.changeUsername.bind(this);
  }

  render() {
    ReactDOM.render(
      <GameList username={this.getUsername()}
                gameUsers={this.gameUsers}
                onUsernameChange={this.changeUsername} />,
      this.contentNode);
  }

  changeUsername(newUsername) {
    if (!newUsername.match(/^[a-z]*$/)) return;
    document.cookie = "username=" + newUsername + "; path=/";
    this.render();
  }

  getUsername() {
    let m = document.cookie.match(/\busername=([a-z]+)\b/);
    return m ? m[1] : null;
  }

  onGotGames(e) {
    this.gameUsers = JSON.parse(this.xhr.responseText);
    this.render();
  }

  getGames() {
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener("load", this.onGotGames.bind(this));
    this.xhr.open("GET", "/games");
    this.xhr.send();
  }

  start() {
    this.render();
    this.getGames();
  }
}

let $handler;

function main() {
  $handler = new Handler(document.getElementById("content"));
  $handler.start();
}

main();
