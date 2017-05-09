import { AUTH_USER, UNAUTH_USER, AUTH_ERROR } from '../actions/constants';

const INITIAL_STATE = {
  authenticated: false,
  user: null,
  error: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      // User was successfully authenticated
      return { ...state, authenticated: true, error: '', user: action.payload };
    case UNAUTH_USER:
      return { ...state, authenticated: false, error: '', user: null };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    default:
      break;
  }
  return state;
}
