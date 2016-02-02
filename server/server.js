/* eslint-disable no-console, no-use-before-define */

import path from 'path';
import { Server } from 'hapi';
import Boom from 'boom';

import webpack from 'webpack';
import WebpackPlugin from 'hapi-webpack-plugin';
import webpackConfig from '../webpack.config';

import React from 'react';
import { Provider } from 'react-redux';
import { RouterContext, match, createMemoryHistory } from 'react-router';

import configureStore from '../common/store/configureStore';
import Routes from '../common/containers/Routes';
import { fetchCounter } from '../common/api/counter';

const server = new Server();
const port = 3001;

server.connection({
  host: 'localhost',
  port: 3000,
  labels: ['web']
});

server.connection({
  host: 'localhost',
  port: 3001,
  labels: ['api']
});

const web = server.select('web');
const api = server.select('api');

const compiler = webpack(webpackConfig);


web.route({
  method: 'GET',
  path: '/{param*}',
  handler: (request, reply) => {
    fetchCounter(apiResult => {
      const location = request.path;

      const history = createMemoryHistory();

      const counter = apiResult || 0;

      // Compile an initial state
      const initialState = { counter };

      // Create a new Redux store instance
      const store = configureStore(initialState, history);

      // Grab the initial state from our Redux store
      const finalState = store.getState();

      const routes = Routes();

      match({ routes, location }, (error, redirectLocation, renderProps) => {
        if (error) {
          return reply(Boom.badRequest(error.message));
        }

        if (redirectLocation) {
          return reply.redirect(redirectLocation.pathname + redirectLocation.search);
        }

        if (renderProps) {
          // Render the component to a string
          const html = React.renderToString(
            <Provider store={store}>
              { () => <RouterContext {...renderProps} /> }
            </Provider>
          );

          // Send the rendered page back to the client
          return reply(renderFullPage(html, finalState));
        }

        return reply(Boom.notFound('Not Found'));
      });
    });
  }
});

function renderFullPage (html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux + Hapi API Boilerplate</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}


server.register({
  register : WebpackPlugin,
  options  : {
    compiler,
    assets : { noInfo: true, publicPath: webpackConfig.output.publicPath },
    hot    : { }
  }
}, (error) => {
  if (error) {
    throw error;
  }
  
  server.start((error) => {
    if (error) {
      throw error;
    }

    console.info(`==> 🌎  Open up ${web.info.uri} in your browser.`);
  });
});
