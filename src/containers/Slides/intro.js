import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';

const Intro = props => (
  <div>
    <Header as="h1" color="blue">Welcome to the new VATUSA Exam Center</Header>
    <p>This exam center is a complete rewrite of the previous examination center
      and is designed to increase your experience and increase efficiency in exam
      taking.
    </p>

    <p>Keep in mind <b>ALL</b> examinations are <u>open book</u>.  Please take
  your time completing this exam.
    </p>
    <p>Good luck!  And may the odds be ever in your favor.</p>
    <Segment className="right aligned" basic><Button color="blue" onClick={props.nextFunc}>Test</Button></Segment>
  </div>
);

export default Intro;
