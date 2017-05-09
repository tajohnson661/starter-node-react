import React from 'react';
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import ConnectedSigninForm, { Signin } from './Signin';

injectTapEventPlugin();

describe('components', () => {
  describe('<ConnectedSigninForm />', () => {
    let signInUser;

    const setupStore = () => {
      const INITIAL_AUTH_STATE = {
        authenticated: true,
        user: null,
        error: 'some error'
      };

      const mockAuthReducer = (state = INITIAL_AUTH_STATE) => {
        return state;
      };

      const store = createStore(combineReducers({ form: formReducer, auth: mockAuthReducer }));
      signInUser = jest.fn();
      const props = {
        signInUser
      };
      return mount(
        <Provider store={store} >
          <MuiThemeProvider>
            <ConnectedSigninForm {...props} />
          </MuiThemeProvider>
        </Provider>
      );
    };

    it('should render the ConnectedHeader component', () => {
      const subject = setupStore();
      expect(subject.length).toEqual(1);
    });

    it('should check Prop matches with initialState', () => {
      const subject = setupStore();
      // to get the props passed to the Signin component, find the actual component...
      const component = subject.find(Signin);
      expect(component.prop('errorMessage')).toEqual('some error');
    });

    it('calls signInUser on valid submit', () => {
      const subject = setupStore();
      const inputs = subject.find('input');
      const emailInput = inputs.first();
      const passwordInput = inputs.at(1);
      emailInput.simulate('change', { target: { value: 'a@example.com' } });
      passwordInput.simulate('change', { target: { value: 'abcd' } });

      subject.find('form').simulate('submit');
      expect(signInUser.mock.calls.length).toEqual(1);
    });

    it('doesn\'t call signInUser on invalid submit', () => {
      const subject = setupStore();
      const inputs = subject.find('input');
      const emailInput = inputs.first();
      emailInput.simulate('change', { target: { value: 'a@example.com' } });

      subject.find('form').simulate('submit');
      expect(signInUser.mock.calls.length).toEqual(0);
    });

    it('doesn\'t submit on invalid email', () => {
      const subject = setupStore();
      const inputs = subject.find('input');
      const emailInput = inputs.first();
      const passwordInput = inputs.at(1);
      emailInput.simulate('change', { target: { value: 'aexample.com' } });
      passwordInput.simulate('change', { target: { value: 'abcd' } });

      subject.find('form').simulate('submit');
      expect(signInUser.mock.calls.length).toEqual(0);
    });
  });
});
