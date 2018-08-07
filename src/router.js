import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Welcome from './pages/welcome';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Welcome} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
