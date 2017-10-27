import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import configureStore from './store/configureStore';
import Main from './components/main';
import './semantic/dist/semantic.min.css';

const store = configureStore(Immutable.Map());

ReactDOM.render(<Main store={store} />, document.getElementById('root'));
