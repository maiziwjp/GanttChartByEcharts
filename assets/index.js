import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'mobx-react';
import store from 'store/index';
import App from './app';

ReactDom.render(
  <Provider {...store}>
    <App/>
  </Provider>,
document.getElementById('app')
)
