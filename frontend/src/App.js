import React from 'react';
import {Route, Switch} from 'react-router-dom'
import About from './Component/About/About'
import Home from './Component/Home/Home'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' component={Home} />
        <Route path='/about' component={About} />
      </Switch>
    </div>
  );
}

export default App;
