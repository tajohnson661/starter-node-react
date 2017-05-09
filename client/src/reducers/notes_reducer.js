import {
  FETCH_NOTE, FETCH_NOTES, CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE, CLEAR_NOTE, CLEAR_NOTES
} from '../actions/constants';

const INITIAL_STATE = {
  data: null,
  currentNote: null,
  error: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_NOTES:
      if (action.error) {
        return {
          ...state, data: null, currentNote: null
        };
      }
      return {
        ...state, data: action.payload, currentNote: null
      };
    case FETCH_NOTE:
      if (action.error) {
        return {
          ...state, currentNote: null
        };
      }
      return {
        ...state, currentNote: action.payload
      };
    case CLEAR_NOTES:
      return {
        ...state, data: null
      };
    case CLEAR_NOTE:
      return {
        ...state, currentNote: null
      };
    case CREATE_NOTE:
      return {
        ...state, currentNote: action.payload
      };
    case UPDATE_NOTE:
      return {
        ...state, currentNote: action.payload
      };
    case DELETE_NOTE:
      return {
        ...state, currentNote: null
      };
    default:
      return state;
  }
}
