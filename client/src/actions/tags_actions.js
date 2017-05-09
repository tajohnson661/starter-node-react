import axios from 'axios';
import { browserHistory } from 'react-router';

import Utils from './utils';
import {
  ROOT_API_URL, FETCH_TAGS, FETCH_TAG, CREATE_TAG, UPDATE_TAG, DELETE_TAG, CLEAR_TAGS, CLEAR_TAG
} from './constants';

const ROOT_TAGS_API_URL = `${ROOT_API_URL}/tags`;

export const fetchTags = () => {
  return Utils.get(ROOT_TAGS_API_URL, FETCH_TAGS, CLEAR_TAGS);
};

export const fetchTag = (id) => {
  return Utils.get(`${ROOT_TAGS_API_URL}/${id}`, FETCH_TAG, CLEAR_TAG);
};

const createTag = (dispatch, tag) => {
  axios.post(`${ROOT_TAGS_API_URL}`, tag, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then((response) => {
      dispatch({ type: CREATE_TAG, payload: response.data });
      browserHistory.push('/tags');
    })
    .catch(() => {
    });
};

const updateTag = (dispatch, tag, id) => {
  axios.put(`${ROOT_TAGS_API_URL}/${id}`, tag, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then((response) => {
      dispatch({ type: UPDATE_TAG, payload: response.data });
      browserHistory.push(`/tags/${id}`);
    })
    .catch(() => {
    });
};

export const createOrUpdateTag = (tag, id) => {
  return function (dispatch) {
    id ? updateTag(dispatch, tag, id) : createTag(dispatch, tag);
  };
};

export const deleteTag = (id) => {
  return function (dispatch) {
    axios.delete(`${ROOT_TAGS_API_URL}/${id}`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then((response) => {
        dispatch({ type: DELETE_TAG, payload: response.data });
        browserHistory.push('/tags');
      })
      .catch(() => {
      });
  };
};

export const clearTag = () => {
  return {
    type: CLEAR_TAG,
    payload: null
  };
};

