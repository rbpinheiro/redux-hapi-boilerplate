import 'babel-core/polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import configureStore from '../common/store/configureStore';
import Routes from '../common/containers/Routes';

const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState, browserHistory);

const rootElement = document.getElementById('app');

React.render(
  <Provider store={store}>
    {Routes}
  </Provider>,
  rootElement
);
