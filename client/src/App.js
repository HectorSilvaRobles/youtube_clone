import React, {Suspense} from 'react';
import {Route, Switch} from 'react-router-dom'
import Auth from './hoc/auth';

import Home from './Component/Home/Home'
import Login from './Component/LoginPage/LoginPage'
import Register from './Component/RegisterPage/RegisterPage'
import NavBar from './Component/NavBar/NavBar'


function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{paddingTop: '75px', minHeight: 'calc(100vh - 80px'}}>
        <Switch>
          <Route exact path='/' component={Auth(Home, null)} />
          <Route path='/login' component={Auth(Login, false)} />
          <Route path='/register' component={Auth(Register, false)} />
        </Switch>
      </div>
    </Suspense>
    
  );
}

export default App;
