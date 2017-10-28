import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchToken } from '../ducks/auth';
import { fetchExam } from '../ducks/exam';

class ExamBox extends Component {
  componentDidMount() {
    if (this.props.auth.getIn(['isAuthenticated']) !== true) {
      this.tokenDispatcher = setInterval(this.props.dispatchauth(), this.props.auth.getIn(['token', 'ttl']) - 60);
      Promise
        .resolve(this.props.dispatchauth())
        .then(() => { this.props.dispatchexam(); }, () => { console.log('Failed!'); });
    }
  }
  componentWillUnmount() {
    clearInterval(this.tokenDispatcher);
  }
  render() {
    if (this.props.auth.getIn(['isAuthenticated']) !== true) {
      return (<div>Attempting to get token.</div>);
    }
    if (this.props.exam.getIn(['hasExam']) !== true) {
      return (<div>Getting exam.</div>);
    }
    return (<div>Ready.</div>);
  }
}

const mapStateToProps = state => ({
  auth: state.get('auth'),
  exam: state.get('exam'),
});
const mapDispatchToProps = dispatch => ({
  dispatchauth: () => { dispatch(fetchToken()); },
  dispatchexam: () => { dispatch(fetchExam()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExamBox);
