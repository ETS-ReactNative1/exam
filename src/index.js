import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import configureStore from './store/configureStore';
import Main from './containers/main';
import './semantic/dist/semantic.min.css';

const store = configureStore(Immutable.Map());
console.dir(store);
ReactDOM.render(<Main store={store} />, document.getElementById('root'));
