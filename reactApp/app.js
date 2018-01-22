import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
} from 'react-router-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  Container,
} from './Components/Container';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <HashRouter>
      <Container />
    </HashRouter>
  </MuiThemeProvider>,
  document.getElementById('root'));
