import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Router from './Router';
import store from './store/Store';
import theme from './stylesheets/theme';

const App = () => (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
);

// export default withAuthenticator(App);
export default (App);