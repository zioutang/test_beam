import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import {
  Login,
} from './AuthComponents/Login';

import {
  Board,
} from './Board';

import {
  Register,
} from './AuthComponents/Register';

const Container = () => (
  <div>
    <Switch>
      <Route exact path="/board" component={Board} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/" component={Login} />
    </Switch>
  </div>
);

module.exports = {
  Container,
};
