import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import Header from './Header';

class Main extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div className="container">
            <Header />
            <Switch>
              <Route exact path="/" />
            </Switch>

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
