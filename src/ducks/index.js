import { combineReducers } from 'redux-immutable';
import auth from './auth';
import exam from './exam';

const app = combineReducers({
  auth,
  exam,
});

export default app;
