import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignIn, AmplifySignUp, withAuthenticator, } from '@aws-amplify/ui-react'
import Home from './containers/Home.jsx';

const Router = () => (
    <AmplifyAuthenticator>
    <AmplifySignIn headerText="Deliveries.dev" slot="sign-in" 
      formFields={[
        { type: "username" ,
          label:"Email Address*"  ,
          placeholder: "Enter your email"},
        {
          type: "password",
          label: "Password*",
          placeholder: "Password"
         }
      ]}/>
    <AmplifySignUp headerText="Deliveries.dev" slot="sign-up" 
      formFields={[
        { type: "username" ,
          label:"Email Address*"  ,
          placeholder: "Enter your email"},
        {
         type: "password",
         label: "Password*",
         placeholder: "Password"
       },
      ]}/>
        <Switch>
            <Route path='/' exact component={Home} />  
        </Switch>
    </AmplifyAuthenticator>
);

export default Router; 