import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ExamBox from './exambox';
import Header from './Header';

class Main extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div className="container">
            <Header />
            <Container style={{ marginTop: '20px' }}>
              <Segment color="blue">
                <Switch>
                  <Route exact path="/" component={ExamBox} />
                </Switch>
              </Segment>
            </Container>
          </div>
        </Router>
      </Provider>
    );
  }
}

Main.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Main;
