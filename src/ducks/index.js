import { combineReducers } from 'redux-immutable';
import auth from './auth';

const app = combineReducers({
  auth,
});

export default app;
