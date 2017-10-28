import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';
import apiurl from './apiurl';

export const REQUEST_EXAM = 'REQUEST_EXAM';
export const RECEIVE_EXAM = 'RECEIVE_EXAM';

export const requestExam = () => (
  { type: REQUEST_EXAM }
);

export const receiveExam = json => (
  { type: RECEIVE_EXAM, exam: json }
);

export const fetchExam = () =>
  (dispatch) => {
    dispatch(requestExam());
    return fetch(`${apiurl}/v2/exam/request`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => response.json())
      .then(json => dispatch(receiveExam(Immutable.fromJS(json))));
  };

export default function exam(state = Immutable.fromJS({
  exam: '', payload: '', hasExam: false, isFetching: false,
}), action) {
  switch (action.type) {
    case REQUEST_EXAM: {
      return state.setIn(['isFetching'], true);
    }
    case RECEIVE_EXAM: {
      let newState = state.setIn(['isFetching'], false);
      newState = newState.setIn(['hasExam'], true);
      newState = newState.setIn(['payload'], action.exam.get('payload'));
      const e = action.exam.get('payload').split('.')[0];
      newState = newState.setIn(['exam'], JSON.parse(atob(e)));
      return newState;
    }
    default: {
      return state;
    }
  }
}
