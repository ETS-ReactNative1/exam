import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';
import apiurl from './apiurl';

export const REQUEST_EXAM = 'REQUEST_EXAM';
export const RECEIVE_EXAM = 'RECEIVE_EXAM';
export const ERROR_EXAM = 'ERROR_EXAM';
export const BEGIN_EXAM = 'BEGIN_EXAM';
export const END_EXAM = 'END_EXAM';
export const UPDATE_EXAM = 'UPDATE_EXAM';
export const POSITION_EXAM = 'POSITION_EXAM';

export const requestExam = () => (
  { type: REQUEST_EXAM }
);

export const receiveExam = json => (
  { type: RECEIVE_EXAM, exam: json }
);

export const errorExam = e => (
  { type: ERROR_EXAM, message: e }
);

export const beginExam = () => (
  { type: BEGIN_EXAM }
);

export const endExam = () => (
  { type: END_EXAM }
);

export const updateExam = (id, choice) => (
  { type: UPDATE_EXAM, id, choice }
);

export const fetchExam = () =>
  (dispatch) => {
    dispatch(requestExam());
    return fetch(`${apiurl}/v2/exam/request`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(json => dispatch(receiveExam(Immutable.fromJS(json))))
      .catch(e => dispatch(errorExam(Immutable.fromJS(e))));
  };

export default function exam(state = Immutable.fromJS({
  exam: '',
  payload: '',
  hasExam: false,
  isFetching: false,
  hasErrored: false,
  inProgress: false,
  answers: {},
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
    case ERROR_EXAM: {
      let newState = state.setIn(['isFetching'], false);
      newState = newState.setIn(['hasExam'], false);
      newState = newState.setIn(['payload'], action.message);
      newState = newState.setIn(['hasErrored'], true);
      return newState;
    }
    case BEGIN_EXAM: {
      return state.setIn(['inProgress'], true);
    }
    case END_EXAM: {
      return state.setIn(['inProgress'], false);
    }
    case UPDATE_EXAM: {
      // This will add/modify based on given id
      return state.setIn(['answers', action.id], action.choice);
    }
    default: {
      return state;
    }
  }
}
