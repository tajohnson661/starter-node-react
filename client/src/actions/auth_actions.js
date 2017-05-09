import axios from 'axios';
import { browserHistory } from 'react-router';

import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, ROOT_API_URL } from './constants';
import Utils from './utils';

const ROOT_AUTH_URL = `${ROOT_API_URL}/auth`;
const ROOT_USERS_URL = `${ROOT_API_URL}/users`;

export const getLoggedInUser = () => {
  return Utils.get(`${ROOT_USERS_URL}/me`, AUTH_USER);
};

export const signInUser = ({ email, password }) => {
  // We can't just use redux-promise here because if the data is bad, we don't want to
  //  call into the reducer.  We'll use redux-thunk
  // Action creator usually creates and return an action, and then redux sends the
  //  action through the Dispatch, which sends it to each of the reducers.
  // Redux-thunk gets us direct access to the Dispatch method
  // Using redux-thunk, instead of returning an object, we can return a function
  return function (dispatch) {
    // Submit email/password to server
    axios.post(`${ROOT_AUTH_URL}/signin`, { email, password }) // { email: email, password: password }
      .then((response) => {
        // If request is good...
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER, payload: response.data.user });

        // - Save the JWT token in LocalStorage in the browser, which is specific to the domain
        // localStorage available on window (global) scope, so no import needed
        localStorage.setItem('token', response.data.token);

        // - Redirect to home
        browserHistory.push('/');
      })
      .catch(() => {
        // If request is bad...
        // - show error to user
        dispatch(authError('Bad email or password'));
      });
  };
};

export const signUpUser = ({ email, password }) => {
  return function (dispatch) {
    axios.post(`${ROOT_AUTH_URL}/signup`, { email, password })
      .then((response) => {
        dispatch({ type: AUTH_USER, payload: response.data.user });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/');
      })
      .catch((response) => {
        dispatch(authError(response.data.error));
      });
  };
};

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signOutUser() {
  localStorage.removeItem('token');
  browserHistory.push('/signin');
  return {
    type: UNAUTH_USER
  };
}
