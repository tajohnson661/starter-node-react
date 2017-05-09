import React from 'react';
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import ConnectedCreateOrUpdateTagForm, { CreateOrUpdateTag } from './CreateTag';

injectTapEventPlugin();

describe('components', () => {
  describe('<ConnectedCreateOrUpdateTagForm />', () => {
    let createOrUpdateTag;
    let fetchTag;

    const setupStore = (editTag = false) => {
      const INITIAL_TAGS_STATE = {
        data: null,
        currentTag: { name: 'hi there' }
      };

      const mockTagsReducer = (state = INITIAL_TAGS_STATE) => {
        return state;
      };

      const store = createStore(combineReducers({
        form: formReducer, tags: mockTagsReducer
      }));
      createOrUpdateTag = jest.fn();
      fetchTag = jest.fn();

      const props = {
        createOrUpdateTag,
        fetchTag
      };
      if (editTag) {
        props.params = { id: 'xxx-yyy' };
      }
      return mount(
        <Provider store={store}>
          <MuiThemeProvider>
            <ConnectedCreateOrUpdateTagForm {...props} />
          </MuiThemeProvider>
        </Provider>
      );
    };

    it('should render the ConnectedCreateOrUpdateTagForm component', () => {
      const subject = setupStore();
      expect(subject.length).toEqual(1);
    });

    it('should not call fetchTag on new tag', () => {
      setupStore();
      expect(fetchTag.mock.calls.length).toEqual(0);
    });

    it('should call fetchTag on edit note', () => {
      setupStore(true);
      expect(fetchTag.mock.calls.length).toEqual(1);
    });

    it('should check Prop matches with initialState', () => {
      const subject = setupStore();
      const component = subject.find(CreateOrUpdateTag);
      expect(component.prop('currentTag')).toEqual({ name: 'hi there' });
    });

    it('calls createOrUpdateTag on valid submit', () => {
      const subject = setupStore();
      const tagInput = subject.find('input[name="name"]');
      tagInput.simulate('change', { target: { value: 'here is some tag text' } });

      subject.find('form').simulate('submit');
      expect(createOrUpdateTag.mock.calls.length).toEqual(1);
      expect(createOrUpdateTag.mock.calls[0][0]).toEqual({ name: 'here is some tag text' });
    });

    it('doesn\'t submit on invalid form data', () => {
      const subject = setupStore();
      const tagInput = subject.find('input[name="name"]');
      tagInput.simulate('change', { target: { value: '' } });

      subject.find('form').simulate('submit');
      expect(createOrUpdateTag.mock.calls.length).toEqual(0);
    });
  });
});
