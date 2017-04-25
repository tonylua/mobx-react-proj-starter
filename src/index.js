import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';

import '../this_is_a_sample_css.css';
import './global.less';

import '../node_modules/roboto-fontface/fonts/Roboto/Roboto-Regular.eot';
import '../node_modules/roboto-fontface/fonts/Roboto/Roboto-Regular.woff';
import '../node_modules/roboto-fontface/fonts/Roboto/Roboto-Regular.woff2';
import '../node_modules/roboto-fontface/fonts/Roboto/Roboto-Regular.ttf';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App)
  });
}