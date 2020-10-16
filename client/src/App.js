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

function App() {
  return (
    // <Provider store={store}>
      <Router>
      <div className="App">
        <Switch>
          
        </Switch>
      </div>
      </Router>
    // </Provider>
  );
}

export default App;
