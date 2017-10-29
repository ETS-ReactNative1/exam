import React from 'react';
import { Button, Form, Grid, Icon, Header } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

class Question extends React.Component {
  static shuffle(l) {
    const a = l;
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  render() {
    let options;
    if (this.props.question.type === 0) {
      options = this.props.question.order.map(v => (
        <Form.Radio
          key={v}
          label={this.props.question[v]}
          value={v}
          onChange={this.props.handleChange}
          checked={this.props.valueState === v}
        />));
    }
    return (
      <div>
        <Header as="h3" >
          {this.props.position + 1}. {ReactHtmlParser(this.props.question.question)}
        </Header>
        <Form>
          { this.props.question.type === 0 &&
            options
          }
          { this.props.question.type === 1 &&
            <Form.Group grouped>
              <Form.Radio
                label="True"
                value={this.props.question.one === 'True' ? 'one' : 'two'}
                onChange={this.props.handleChange}
                checked={this.props.valueState === (this.props.question.one === 'True' ? 'one' : 'two')}
              />
              <Form.Radio
                label="False"
                value={this.props.question.one === 'False' ? 'one' : 'two'}
                onChange={this.props.handleChange}
                checked={this.props.valueState === (this.props.question.one === 'False' ? 'one' : 'two')}
              />
            </Form.Group>
          }
        </Form>
        <br />
        <Grid>
          <Grid.Column width="8">
            {this.props.position !== 0 &&
              <Button color="green" onClick={this.props.prevFunc}>
                <Icon name="left arrow" /> Back
              </Button>}
          </Grid.Column>
          <Grid.Column width="8" className="right aligned">
            <Button color="blue" onClick={this.props.nextFunc}>
              {(this.props.last) ? 'Finish' : 'Next'} <Icon name="right arrow" />
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Question;
