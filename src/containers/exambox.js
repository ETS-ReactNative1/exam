import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Header, Message } from 'semantic-ui-react';

import { fetchToken } from '../ducks/auth';
import { fetchExam, updateExam, endExam, beginExam, submitExam } from '../ducks/exam';
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
    if (this.position === this.props.exam.getIn(['exam']).numQuestions - 1 && !this.intro) {
      // This is where we will handle submission.
      this.props.dispatchEndExam();
      this.props.dispatchSubmitExam(
        this.props.exam.getIn(['payload']),
        JSON.stringify(this.props.exam.getIn(['answers'])),
      );
    } else {
      if (this.intro === true) {
        this.intro = false;
        this.props.dispatchBeginExam();
      } else {
        this.position += 1;
      }
      this.question = this.props.exam.getIn(['exam']).questions[this.position];
      let value = this.props.exam.getIn(['answers', this.question.id]);
      if (value === undefined) value = '';
      this.setState({ value });
      this.forceUpdate();
    }
  }
  prevFunc() {
    this.position -= 1;
    if (this.position < 0) { this.position = 0; }
    this.question = this.props.exam.getIn(['exam']).questions[this.position];
    let value = this.props.exam.getIn(['answers', this.question.id]);
    if (value === undefined) {
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
    if (this.props.exam.getIn(['hasExam']) !== true && this.props.exam.getIn(['hasErrored']) !== true) {
      return (<div>Getting exam.</div>);
    }
    if (this.props.exam.getIn(['hasErrored']) === true) {
      return (
        <Message negative>
          <Message.Header><Icon name="warning sign" /> Exam Generation Error</Message.Header>
          <p>There was an error retrieving the examination from the VATUSA API.</p>
          <p>The message we got was <b>{this.props.exam.getIn(['payload'])}</b>
          </p>
        </Message>
      );
    }
    if (this.intro) {
      return (<Intro nextFunc={this.nextFunc} />);
    }
    if (this.props.exam.getIn(['isComplete']) === -1) {
      return (
        <div>
          <Header as="h1" color="blue">{this.props.exam.getIn(['exam']).name}</Header>
          <Question
            position={this.position}
            question={this.question}
            handleChange={this.handleChange}
            valueState={this.state.value}
            nextFunc={this.nextFunc}
            prevFunc={this.prevFunc}
            last={this.position === this.props.exam.getIn(['exam']).numQuestions - 1}
          />
        </div>
      );
    }
    if (this.props.exam.getIn(['isComplete']) === 0 || this.props.exam.getIn(['isComplete']) === 1) {
      return (<div>Submitting exam... Please wait.</div>);
    }
    if (this.props.exam.getIn(['isComplete']) === 2) {
      if (this.props.exam.getIn(['payload', 'status']) !== undefined) {
        return (
          <Message negative>
            <Message.Header><Icon name="warning sign" /> Exam Submission Error</Message.Header>
            <p>There was an error submitting the examination to the VATUSA API.</p>
            <p>The message we got was <b>{this.props.exam.getIn(['payload', 'msg'])}</b>
            </p>
          </Message>);
      }
      if(this.props.exam.getIn(['exam']).id == 7) {
        if(this.props.exam.getIn(['payload', 'results']) === "Passed.") {
          return (
            <div>
              <p>You have <strong>passed</strong> your exam. Congratulations! Please select one of the following links:</p>
              <p>If you are a <strong>new</strong> controller, select your facility <a href="https://www.vatusa.net/my/select">here</a>.</p>
              <p>If you are a <strong>returning</strong> controller and were previously part of a facility, transfer to your facility of choice <a href="https://www.vatusa.net/my/transfer">here</a>.</p>
              <p><a href="https://www.vatusa.net/exam/">Return to VATUSA</a></p>
            </div>);
        }
        return (
        <div>
          <p>Your exam has been graded.</p>
          <p>You <strong>did not pass</strong> your exam. You must pass in order to select a facility. Your exam will be automatically reassigned in 3 days.</p>
          <p><a href="https://www.vatusa.net/exam/">Return to VATUSA</a></p>
        </div>);
        }     
      return (
      <div>
        <p>Your exam has been graded.</p>
        <p>The result of your exam is: <strong>{this.props.exam.getIn(['payload', 'results'])}</strong></p>
        <p><a href="https://www.vatusa.net/exam/">Return to VATUSA</a></p>
      </div>);
    }
    return (<div>Unknown location!!!</div>);
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
  dispatchBeginExam: () => { dispatch(beginExam()); },
  dispatchEndExam: () => { dispatch(endExam()); },
  dispatchSubmitExam: (payload, answers) => { dispatch(submitExam(payload, answers)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExamBox);
