import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';
import notesReducer from './notes_reducer';
import tagsReducer from './tags_reducer';

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  auth: authReducer,
  notes: notesReducer,
  tags: tagsReducer
});

export default rootReducer;
