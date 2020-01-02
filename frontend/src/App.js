import React from 'react';
import {Route, Switch} from 'react-router-dom'
import About from './Component/About/About'
import Home from './Component/Home/Home'
import Login from './Component/LoginPage/LoginPage'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/login' component={Login} />
      </Switch>
    </div>
  );
}

export default App;
