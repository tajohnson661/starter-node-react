import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from './components/App/App';
import Home from './components/Home/Home';
import ConnectedSignin from './components/auth/Signin';
import ConnectedSignout from './components/auth/Signout';
import ConnectedSignup from './components/auth/Signup';
import ConnectedNotes from './components/Notes/Notes';
import ConnectedNote from './components/Notes/Note';
import ConnectedTags from './components/Tags/Tags';
import ConnectedTag from './components/Tags/Tag';
import ConnectedCreateOrUpdateNote from './components/Notes/CreateNote';
import ConnectedCreateOrUpdateTag from './components/Tags/CreateTag';

// TODO: The following was replaced with redux-auth-wrapper.  Keep this around to make sure we still
// want to use it.
// import RequireAuth from './components/auth/RequireAuth';

// Redirects to /login by default
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.auth, // how to get the user state
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  failureRedirectPath: '/signin',  // TODO: this doesn't seem to be working
  predicate: auth => auth.authenticated,
  wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
});

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/signin" component={ConnectedSignin} />
    <Route path="/signout" component={ConnectedSignout} />
    <Route path="/signup" component={ConnectedSignup} />
    <Route path="/notes/new" component={UserIsAuthenticated(ConnectedCreateOrUpdateNote)} />
    <Route path="/notes/:id" component={UserIsAuthenticated(ConnectedNote)} />
    <Route path="/notes/:id/edit" component={UserIsAuthenticated(ConnectedCreateOrUpdateNote)} />
    <Route path="/notes" component={UserIsAuthenticated(ConnectedNotes)} />
    <Route path="/tags/new" component={UserIsAuthenticated(ConnectedCreateOrUpdateTag)} />
    <Route path="/tags" component={UserIsAuthenticated(ConnectedTags)} />
    <Route path="/tags/:id" component={UserIsAuthenticated(ConnectedTag)} />
    <Route path="/tags/:id/edit" component={UserIsAuthenticated(ConnectedCreateOrUpdateTag)} />
  </Route>
);
