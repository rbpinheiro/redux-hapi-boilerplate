import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from './Main';
import * as CounterActions from '../actions/counter';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={Main} />

  </Router>
);