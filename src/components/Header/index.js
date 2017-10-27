import React from 'react';
import { Menu, Header } from 'semantic-ui-react';

export default class appHeader extends React.Component {
  render() {
    return (
      <section className="header">
        <Menu inverted color="blue">
          <Menu.Item name="title">
            <Header as="h2" inverted>VATUSA Exam Center</Header>
          </Menu.Item>
        </Menu>
      </section>
    );
  }
}
