import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; //injects global store
import { createStore } from 'redux';
import searchJobListing from './store/reducers';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(
  searchJobListing,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//Provider
//add store as property to make it available to entire app

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
