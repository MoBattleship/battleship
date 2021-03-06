import React, { useState, useEffect } from 'react';
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

//pages
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage/Preparation/index'
import LobbyPage from './pages/LobbyPage/index'
import EndGamePage from './pages/EndGamePage/index'
import Start from './pages/GamePage/Start/index'


function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/games" component={GamePage} />
          <Route path='/lobby' component={LobbyPage} />
          <Route path='/endgame' component={EndGamePage} />
          <Route path='/start' component={Start} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
