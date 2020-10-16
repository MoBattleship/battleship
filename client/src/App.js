import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Provider } from "react-redux";
// import store from './store'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import LobbyPage from './pages/LobbyPage';

//pages
import HomePage from './pages/HomePage'

function App() {
  return (
    // <Provider store={store}>
      <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path='/lobby' component={LobbyPage} />

          

        </Switch>
      </div>
      </Router>
    // </Provider>
  );
}

export default App;
