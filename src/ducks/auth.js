import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const requestToken = () => (
  { type: REQUEST_TOKEN }
);

export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const receiveToken = json => (
  { type: RECEIVE_TOKEN, token: json }
);

export const fetchToken = () => (
  (dispatch) => {
    dispatch(requestToken());
    return fetch('https://api.vatusa.dev/v2/auth/token', { credentials: 'include' })
      .then(response => response.json())
      .then(json => dispatch(receiveToken(Immutable.fromJS(json))));
  }
);

export default function token(state = Immutable.fromJS({ token: '', fetching: false }), action) {
  switch (action.type) {
    case REQUEST_TOKEN: {
      return state.setIn(['fetching'], true);
    }
    case RECEIVE_TOKEN: {
      let newState = state.setIn(['fetching'], false);
      newState = newState.setIn(['token'], action.token.token);
      return newState;
    }
    default: {
      return state;
    }
  }
}
