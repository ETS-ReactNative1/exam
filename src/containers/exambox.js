import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchToken } from '../ducks/auth';
import { fetchExam } from '../ducks/exam';
import Intro from './Slides/intro';

class ExamBox extends Component {
  constructor(props) {
    super(props);

    this.nextFunc = this.nextFunc.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.getIn(['isAuthenticated']) !== true) {
      // Refresh token every 30 minutes
      this.tokenDispatcher = setInterval(
        () => { this.props.dispatchauth(); }
        , 1000 * 60 * 30,
      );
      this.props.dispatchauth();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.getIn(['isAuthenticated']) === true && this.props.auth.getIn(['isAuthenticated']) === false) {
      this.props.dispatchexam();
    }
  }
  componentWillUnmount() {
    clearInterval(this.tokenDispatcher);
  }
  nextFunc() {
    console.log('Hi');
  }
  render() {
    if (this.props.auth.getIn(['isAuthenticated']) !== true && this.props.auth.getIn(['hasErrored']) !== true) {
      return (<div>Attempting to get token.</div>);
    }
    if (this.props.auth.getIn(['hasErrored']) === true) {
      return (
        <div>There was an error getting your authentication token.
          Please return to VATUSA and attempt to relogin to the website.
        </div>
      );
    }
    if (this.props.exam.getIn(['hasExam']) !== true) {
      return (<div>Getting exam.</div>);
    }
    return (<Intro nextFunc={this.nextFunc} />);
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
