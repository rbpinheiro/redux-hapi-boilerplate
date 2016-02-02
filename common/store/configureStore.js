import { createStore, applyMiddleware } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState, history) {
  const reduxRouterMiddleware = syncHistory(history);

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    reduxRouterMiddleware
  )(createStore);

  const finalCreateStore = (
    typeof window === 'object' && window.devToolsExtension
    ? window.devToolsExtension()(createStoreWithMiddleware)
    : createStoreWithMiddleware
  );


  const store = finalCreateStore(rootReducer, initialState);


  reduxRouterMiddleware.listenForReplays(store);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
