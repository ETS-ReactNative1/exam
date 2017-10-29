import React from 'react';
import { Button, Form, Grid, Icon, Header } from 'semantic-ui-react';

class Question extends React.Component {
  render() {
    return (
      <div>
        <Header as="h3">
          {this.props.position + 1}. {this.props.question.question}
        </Header>
        <Form>
          { this.props.question.type === 0 &&
            <Form.Group grouped>
              <Form.Radio
                label={this.props.question.one}
                value="one"
                onChange={this.props.handleChange}
                checked={this.props.valueState === 'one'}
              />
              <Form.Radio
                label={this.props.question.two}
                value="two"
                onChange={this.props.handleChange}
                checked={this.props.valueState === 'two'}
              />
              <Form.Radio
                label={this.props.question.three}
                value="three"
                onChange={this.props.handleChange}
                checked={this.props.valueState === 'three'}
              />
              <Form.Radio
                label={this.props.question.four}
                value="four"
                onChange={this.props.handleChange}
                checked={this.props.valueState === 'four'}
              />
            </Form.Group>
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
                value={this.props.question.one === 'True' ? 'one' : 'two'}
                onChange={this.props.handleChange}
                checked={this.props.valueState === (this.props.question.one === 'True' ? 'one' : 'two')}
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
              Next <Icon name="right arrow" />
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Question;
