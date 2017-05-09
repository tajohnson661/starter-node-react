import React from 'react';
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import ConnectedCreateOrUpdateNoteForm, { CreateOrUpdateNote } from './CreateNote';

injectTapEventPlugin();

const tagList = [{ id: '123', name: 'tag1' }, { id: '234', name: 'tag2' }, { id: 'xyz', name: 'tag3' }];

describe('components', () => {
  describe('<ConnectedCreateOrUpdateNoteForm />', () => {
    let createOrUpdateNote;
    let fetchTags;
    let fetchNote;

    const setupStore = (editNote = false) => {
      const INITIAL_NOTES_STATE = {
        data: null,
        currentNote: { text: 'hi there' },
        error: 'some error'
      };
      const INITIAL_TAGS_STATE = {
        data: tagList,
        currentTag: null
      };

      const mockNotesReducer = (state = INITIAL_NOTES_STATE) => {
        return state;
      };

      const mockTagsReducer = (state = INITIAL_TAGS_STATE) => {
        return state;
      };

      const store = createStore(combineReducers({
        form: formReducer, notes: mockNotesReducer, tags: mockTagsReducer
      }));
      createOrUpdateNote = jest.fn();
      fetchTags = jest.fn();
      fetchNote = jest.fn();

      const props = {
        createOrUpdateNote,
        fetchTags,
        fetchNote
      };
      if (editNote) {
        props.params = { id: 'xxx-yyy' };
      }
      return mount(
        <Provider store={store}>
          <MuiThemeProvider>
            <ConnectedCreateOrUpdateNoteForm {...props} />
          </MuiThemeProvider>
        </Provider>
      );
    };

    it('should render the ConnectedCreateOrUpdateNoteForm component', () => {
      const subject = setupStore();
      expect(subject.length).toEqual(1);
    });

    it('should call fetchTags, but not fetchNote on new note', () => {
      setupStore();
      expect(fetchTags.mock.calls.length).toEqual(1);
      expect(fetchNote.mock.calls.length).toEqual(0);
    });

    it('should call fetchTags and fetchNote on edit note', () => {
      setupStore(true);
      expect(fetchTags.mock.calls.length).toEqual(1);
      expect(fetchNote.mock.calls.length).toEqual(1);
    });

    it('should check Prop matches with initialState', () => {
      const subject = setupStore();
      // to get the props passed to the CreateOrUpdateNote component, find the actual component...
      const component = subject.find(CreateOrUpdateNote);
      expect(component.prop('errorMessage')).toEqual('some error');
      expect(component.prop('currentNote')).toEqual({ text: 'hi there' });
    });

    it('should have checkboxes for three tags', () => {
      const subject = setupStore();
      const checkboxes = subject.find('input[type="checkbox"]');

      // DEBUG... checkboxes.map(node => node.html()).map(html => console.log('html for checkbox:', html));
      expect(checkboxes.length).toEqual(3);
    });

    it('calls createOrUpdateNote on valid submit', () => {
      const subject = setupStore();
      const noteInput = subject.find('textarea[name="note.text"]');
      noteInput.simulate('change', { target: { value: 'here is some note text' } });

      subject.find('form').simulate('submit');
      expect(createOrUpdateNote.mock.calls.length).toEqual(1);
      expect(createOrUpdateNote.mock.calls[0][0]).toEqual({ text: 'here is some note text', tags: undefined });
    });

    it('doesn\'t submit on invalid form data', () => {
      const subject = setupStore();
      const noteInput = subject.find('textarea[name="note.text"]');
      noteInput.simulate('change', { target: { value: '' } });

      subject.find('form').simulate('submit');
      expect(createOrUpdateNote.mock.calls.length).toEqual(0);
    });

    it('calls createOrUpdateNote on valid submit with a tag checked', () => {
      const subject = setupStore();
      const component = subject.find(CreateOrUpdateNote);

      // Manually call redux-form initialize function to set up expected data structure
      const newTagList = tagList.map((tag) => {
        tag.checkedValue = false;
        return tag;
      });
      // TODO: TEMP hack since click simulation not working...
      newTagList[1].checkedValue = true;

      component.prop('initialize')({
        note: null,
        tags: newTagList
      });

      const noteInput = subject.find('textarea[name="note.text"]');
      noteInput.simulate('change', { target: { value: 'some text' } });

      // TODO: Can't seem to get the material ui checkbox checked
      // const tagCheckbox = subject.find({ type: 'checkbox', name: 'tags[1].checkedValue' }); // works
      // tagCheckbox.simulate('change', { target: { checked: true }}); // doesn't work
      // tagCheckbox.simulate('click'); // doesn't work

      subject.find('form').simulate('submit');

      expect(createOrUpdateNote.mock.calls[0][0]).toEqual({ text: 'some text', tags: ['234'] });
    });
  });
});
