import axios from 'axios';
import { browserHistory } from 'react-router';

import Utils from './utils';
import {
  ROOT_API_URL, FETCH_NOTES, FETCH_NOTE, CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE, CLEAR_NOTE, CLEAR_NOTES
} from './constants';

const ROOT_NOTES_API_URL = `${ROOT_API_URL}/notes`;

export const fetchNotes = () => {
  return Utils.get(ROOT_NOTES_API_URL, FETCH_NOTES, CLEAR_NOTES);
};

export const fetchNote = (id) => {
  return Utils.get(`${ROOT_NOTES_API_URL}/${id}`, FETCH_NOTE, CLEAR_NOTE);
};

const createNote = (dispatch, note) => {
  axios.post(`${ROOT_NOTES_API_URL}`, note, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then((response) => {
      dispatch({ type: CREATE_NOTE, payload: response.data });
      browserHistory.push('/notes');
    })
    .catch(() => {
    });
};

const updateNote = (dispatch, note, id) => {
  axios.put(`${ROOT_NOTES_API_URL}/${id}`, note, {
    headers: { authorization: localStorage.getItem('token') }
  })
    .then((response) => {
      dispatch({ type: UPDATE_NOTE, payload: response.data });
      browserHistory.push(`/notes/${id}`);
    })
    .catch(() => {
    });
};

export const createOrUpdateNote = (note, id) => {
  return function (dispatch) {
    id ? updateNote(dispatch, note, id) : createNote(dispatch, note);
  };
};

export const deleteNote = (id) => {
  return function (dispatch) {
    axios.delete(`${ROOT_NOTES_API_URL}/${id}`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then((response) => {
        dispatch({ type: DELETE_NOTE, payload: response.data });
        browserHistory.push('/notes');
      })
      .catch(() => {
      });
  };
};

