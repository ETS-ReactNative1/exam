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
export const SEND_RESULTS_EXAM = 'SEND_RESULTS_EXAM';
export const RECEIVE_RESULTS_EXAM = 'RECEIVE_RESULTS_EXAM';

export const requestExam = () => (
  { type: REQUEST_EXAM }
);

export const receiveExam = json => (
  { type: RECEIVE_EXAM, exam: json }
);

export const errorExam = json => (
  { type: ERROR_EXAM, message: json.getIn(['msg']) }
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

export const sendResultsExam = () => (
  { type: SEND_RESULTS_EXAM }
);

export const receiveResultsExam = json => (
  { type: RECEIVE_RESULTS_EXAM, json }
);

export const fetchExam = () =>
  (dispatch) => {
    dispatch(requestExam());
    return fetch(`${apiurl}/v2/exam/request`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        const json = response.json();
        if (response.status !== 200) {
          return json.then(Promise.reject.bind(Promise));
        }
        return json;
      })
      .then(json => dispatch(receiveExam(Immutable.fromJS(json.data))))
      .catch(response => dispatch(errorExam(Immutable.fromJS(json.data))));
  };

export const submitExam = (payload, answers) =>
  (dispatch) => {
    dispatch(sendResultsExam());

    return fetch(`${apiurl}/v2/exam/submit`, {
      method: 'POST',
      body: `payload=${payload}&answers=${btoa(answers)}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => dispatch(receiveResultsExam(Immutable.fromJS(json.data))));
  };

export default function exam(state = Immutable.fromJS({
  exam: '',
  payload: '',
  hasExam: false,
  isFetching: false,
  hasErrored: false,
  inProgress: false,
  answers: {},
  isComplete: -1,
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
    case UPDATE_EXAM: {
      // This will add/modify based on given id
      return state.setIn(['answers', action.id], action.choice);
    }
    case END_EXAM: {
      const newState = state.setIn(['isComplete'], 0);
      return newState.setIn(['inProgress'], false);
    }
    case SEND_RESULTS_EXAM: {
      return state.setIn(['isComplete'], 1);
    }
    case RECEIVE_RESULTS_EXAM: {
      let newState = state.setIn(['exam'], '');
      newState = state.setIn(['payload'], action.json);
      return newState.setIn(['isComplete'], 2);
    }
    default: {
      return state;
    }
  }
}
