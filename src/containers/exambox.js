import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Message } from 'semantic-ui-react';

import { fetchToken } from '../ducks/auth';
import { fetchExam, updateExam } from '../ducks/exam';
import Intro from './Slides/intro';
import Question from './Slides/question';

class ExamBox extends Component {
  constructor(props) {
    super(props);

    this.nextFunc = this.nextFunc.bind(this);
    this.prevFunc = this.prevFunc.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.position = 0;
    this.question = {};
    this.intro = true;
    this.state = {};
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
    if (nextProps.auth.getIn(['isAuthenticated']) === true
    && this.props.auth.getIn(['isAuthenticated']) === false
    && this.props.exam.getIn(['hasErrored']) === false) {
      this.props.dispatchexam();
    }
  }
  componentWillUnmount() {
    clearInterval(this.tokenDispatcher);
  }
  nextFunc() {
    if (this.intro === true) {
      this.intro = false;
    } else {
      this.position += 1;
    }
    this.question = this.props.exam.getIn(['exam']).questions[this.position];
    let value = this.props.exam.getIn(['answers', this.question.id]);
    if (value === undefined) value = '';
    this.setState({ value });
    this.forceUpdate();
  }
  prevFunc() {
    this.position -= 1;
    if (this.position < 0) { this.position = 0; }
    this.question = this.props.exam.getIn(['exam']).questions[this.position];
    let value = this.props.exam.getIn(['answers', this.question.id]);
    if (value === undefined) {
      console.log("Setting to ''");
      value = '';
    }
    this.setState({ value });
  }
  handleChange(e, { value }) {
    this.setState({ value });
    this.props.dispatchquestion(this.question.id, value);
  }
  render() {
    if (this.props.auth.getIn(['isAuthenticated']) !== true && this.props.auth.getIn(['hasErrored']) !== true) {
      return (<div>Attempting to get token.</div>);
    }
    if (this.props.auth.getIn(['hasErrored']) === true) {
      return (
        <Message negative>
          <Message.Header><Icon name="warning sign" /> Authentication Error</Message.Header>
          <p>There was an error getting your authentication token.
            Please return to VATUSA and attempt to relogin to the website.
          </p>
          <p style={{ textAlign: 'center' }}><Button as="a" color="red" href="https://login.vatusa.net/?exam">Login via ULS</Button></p>
        </Message>
      );
    }
    if (this.props.exam.getIn(['hasExam']) !== true) {
      return (<div>Getting exam.</div>);
    }
    if (this.props.exam.getIn(['hasErrored']) === true) {
      return (
        <Message negative>
          <Message.Header><Icon name="warning sign" /> Exam Generation Error</Message.Header>
          <p>There was an error retrieving the examination from the VATUSA API.  The
            message we got was {this.props.exam.getIn(['payload'])}
          </p>
        </Message>
      );
    }
    if (this.intro) {
      return (<Intro nextFunc={this.nextFunc} />);
    }
    return (
      <Question
        position={this.position}
        question={this.question}
        handleChange={this.handleChange}
        valueState={this.state.value}
        nextFunc={this.nextFunc}
        prevFunc={this.prevFunc}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.get('auth'),
  exam: state.get('exam'),
});
const mapDispatchToProps = dispatch => ({
  dispatchauth: () => { dispatch(fetchToken()); },
  dispatchexam: () => { dispatch(fetchExam()); },
  dispatchquestion: (id, choice) => { dispatch(updateExam(id, choice)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExamBox);
