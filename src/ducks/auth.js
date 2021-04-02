import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';
import apiurl from './apiurl';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const ERROR_TOKEN = 'ERROR_TOKEN';

export const requestToken = () => (
  { type: REQUEST_TOKEN }
);

export const receiveToken = json => (
  { type: RECEIVE_TOKEN, token: json }
);

export const errorToken = e => (
  { type: ERROR_TOKEN, message: e }
);

export const fetchToken = () =>
  (dispatch) => {
    dispatch(requestToken());
    return fetch(`${apiurl}/v2/auth/token`, { credentials: 'include' })
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(json => dispatch(receiveToken(Immutable.fromJS(json.data))))
      .catch(e => dispatch(errorToken(Immutable.fromJS(e.data))));
  };

export default function token(state = Immutable.fromJS({
  token: '', isAuthenticated: false, isFetching: false, hasErrored: false,
}), action) {
  switch (action.type) {
    case REQUEST_TOKEN: {
      return state.setIn(['isFetching'], true);
    }
    case RECEIVE_TOKEN: {
      let newState = state.setIn(['isFetching'], false);
      newState = newState.setIn(['isAuthenticated'], true);
      newState = newState.setIn(['token'], action.token);
      localStorage.setItem('token', newState.getIn(['token', 'token']));
      return newState;
    }
    case ERROR_TOKEN: {
      let newState = state.setIn(['isFetching'], false);
      newState = newState.setIn(['isAuthenticated'], false);
      newState = newState.setIn(['token'], '');
      newState = newState.setIn(['hasErrored'], true);
      localStorage.removeItem('token');
      return newState;
    }
    default: {
      return state;
    }
  }
}
