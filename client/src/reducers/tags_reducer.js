import {
  FETCH_TAG, FETCH_TAGS, CREATE_TAG, UPDATE_TAG, DELETE_TAG, CLEAR_TAG, CLEAR_TAGS
} from '../actions/constants';

const INITIAL_STATE = {
  data: null,
  currentTag: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TAGS:
      if (action.error) {
        return {
          ...state, data: null
        };
      }
      return {
        ...state, data: action.payload
      };
    case FETCH_TAG:
      if (action.error) {
        return {
          ...state, currentTag: null
        };
      }
      return {
        ...state, currentTag: action.payload
      };
    case CLEAR_TAG:
      return {
        ...state, currentTag: null
      };
    case CLEAR_TAGS:
      return {
        ...state, data: null
      };
    case CREATE_TAG:
      return {
        ...state, currentTag: action.payload
      };
    case UPDATE_TAG:
      return {
        ...state, currentTag: action.payload
      };
    case DELETE_TAG:
      return {
        ...state, currentTag: null
      };
    default:
      return state;
  }
}
