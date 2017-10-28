/* eslint-disable no-underscore-dangle */

import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistState } from 'redux-devtools';
import rootReducer from '../ducks';

let enhancer;
const getDebugSessionKey = () => {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
};

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancer = compose(
    applyMiddleware(thunkMiddleware),
    persistState(getDebugSessionKey()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
} else {
  enhancer = compose(applyMiddleware(thunkMiddleware));
}

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
