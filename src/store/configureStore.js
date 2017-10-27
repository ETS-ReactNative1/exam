import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../ducks';

const enhancer = compose(applyMiddleware(thunkMiddleware));

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
