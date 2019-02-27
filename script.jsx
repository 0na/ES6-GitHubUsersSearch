class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      users: []
    };
  }

  //ma za zadanie zmienić stan searchText na taki, jaki kryje się pod zdarzeniem zmiany inputa (event.target.value).
  onChangeHandle(event) {
    this.setState({
      searchText: event.target.value
    });
  }

  //W metodzie onSubmit wykorzystujemy wiedzę na temat promise'ów. Po skonsturowaniu adresu URL dzięki szablonom ES6 (`https://api.github.com/search/users?q=${searchText}`), wywołujemy funkcję fetch, która zwraca Promise
  onSubmit(event) {
    event.preventDefault();
    const { searchText } = this.state;
    const url = `https://api.github.com/search/users?q=${searchText}`;
    //Funkcja fetch jest interfejsem dzięki któremu możemy pobierać różne zasoby z sieci.
    //Kiedy fetch dostanie odpowiedź z serwera (obietnica zostanie spełniona), do pierwszego then trafia obiekt typu Response, który musimy odpowiednio przekształcić na obiekt JSON (stąd metoda response => response.json()). Wykorzystujemy tu również arrow function, aby uprościć zapis callbacka. Po tym przekształceniu ustawiamy stan users na tablicę items znajdującą się w odpowiedzi od API Githuba.
    fetch(url)
      .then(response => response.json())
      .then(responseJson => this.setState({ users: responseJson.items }));
  }

  //Sam formularz składa się z jednego pola, którego wartość jest wyszukiwaną frazą, po której chcemy odnaleźć użytkownika. Po zatwierdzeniu formularza (wciśnięciu klawisza enter) przez użytkownika, chcemy wysłać do API Githuba zapytanie, a zwrócone dane wyświetlić w komponencie UsersList.
  render() {
    return (
      <div>
        <form onSubmit={event => this.onSubmit(event)}>
          <label htmlFor="searchText"> Search by user name </label>{" "}
          <input
            type="text"
            id="searchText"
            onChange={event => this.onChangeHandle(event)}
            value={this.state.searchText}
          />{" "}
        </form>{" "}
        <UsersList users={this.state.users} />{" "}
      </div>
    );
  }
}

//Jest to bardzo prosty komponent, którego wyróżniającym się elementem jest getter users. W nim dokonujemy przekształcenia tablicy, którą otrzymujemy z komponentu App mapując każdy jej element na komponent User z propsami key oraz user. Wyświetleniem całej listy zajmie się oczywiście metoda render.
class UsersList extends React.Component {
  get users() {
    return this.props.users.map(user => <User key={user.id} user={user} />);
  }

  render() {
    return <div>{this.users}</div>;
  }
}

//W odebranych właściwościach znajduje się pojedynczy obiekt użytkownika (this.props.user), a w nim:adres URL avatara, który chcemy przekazać do elementu <img>,adres URL profilu, który podpinamy do elementu <a>, nazwa usera, którą wyświetlamy w podlinkowaniu

class User extends React.Component {
  render() {
    return (
      <div>
        <img src={this.props.user.avatar_url} style={{ maxWidth: "100px" }} />
        <a href={this.props.user.html_url} target="_blank">
          {this.props.user.login}
        </a>
      </div>
    );
  }
}

//zamontuje główny komponent app pod element o id root:

ReactDOM.render(<App />, document.getElementById("root"));
