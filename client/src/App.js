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

import GamePage from './pages/GamePage'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/games" component={GamePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
