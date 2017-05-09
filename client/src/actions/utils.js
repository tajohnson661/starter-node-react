import axios from 'axios';
import { signOutUser } from './auth_actions';

const get = (url, actionType, clearActionType = null) => {
  return function (dispatch) {
    // ** Hack to clear the data before getting new data.  This forces the props to
    // update (componentWillReceiveProps called) in case the actual data doesn't change
    if (clearActionType) {
      dispatch({ type: clearActionType, payload: null });
    }
    axios.get(url, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then((response) => {
        dispatch({
          type: actionType, payload: response.data
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // token timed out
          dispatch(signOutUser());
        }
      });
  };
};

export default {
  get
};
