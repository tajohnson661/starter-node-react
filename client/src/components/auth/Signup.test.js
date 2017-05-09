import React from 'react';
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import ConnectedSignupForm, { Signup } from './Signup';

injectTapEventPlugin();

describe('components', () => {
  describe('<ConnectedSignupForm />', () => {
    let signUpUser;

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
      signUpUser = jest.fn();
      const props = {
        signUpUser
      };
      return mount(
        <Provider store={store} >
          <MuiThemeProvider>
            <ConnectedSignupForm {...props} />
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
      const component = subject.find(Signup);
      expect(component.prop('errorMessage')).toEqual('some error');
    });

    it('calls signUpUser on valid submit', () => {
      const subject = setupStore();
      const emailInput = subject.find('input[name="email"]');
      const passwordInput = subject.find('input[name="password"]');
      const passwordConfirmInput = subject.find('input[name="passwordConfirm"]');

      emailInput.simulate('change', { target: { value: 'a@example.com' } });
      passwordInput.simulate('change', { target: { value: 'abcd' } });
      passwordConfirmInput.simulate('change', { target: { value: 'abcd' } });

      subject.find('form').simulate('submit');
      expect(signUpUser.mock.calls.length).toEqual(1);
    });

    it('doesn\'t call signUpUser on invalid submit', () => {
      const subject = setupStore();
      const emailInput = subject.find('input[name="email"]');
      emailInput.simulate('change', { target: { value: 'a@example.com' } });

      subject.find('form').simulate('submit');
      expect(signUpUser.mock.calls.length).toEqual(0);
    });

    it('doesn\'t submit on invalid email', () => {
      const subject = setupStore();
      const emailInput = subject.find('input[name="email"]');
      const passwordInput = subject.find('input[name="password"]');
      const passwordConfirmInput = subject.find('input[name="passwordConfirm"]');

      emailInput.simulate('change', { target: { value: 'aexample.com' } });
      passwordInput.simulate('change', { target: { value: 'abcd' } });
      passwordConfirmInput.simulate('change', { target: { value: 'abcd' } });

      subject.find('form').simulate('submit');
      expect(signUpUser.mock.calls.length).toEqual(0);
    });

    it('doesn\'t submit if two passwords don\'t match', () => {
      const subject = setupStore();
      const emailInput = subject.find('input[name="email"]');
      const passwordInput = subject.find('input[name="password"]');
      const passwordConfirmInput = subject.find('input[name="passwordConfirm"]');

      emailInput.simulate('change', { target: { value: 'a@example.com' } });
      passwordInput.simulate('change', { target: { value: 'abcd' } });
      passwordConfirmInput.simulate('change', { target: { value: 'abcde' } });

      subject.find('form').simulate('submit');
      expect(signUpUser.mock.calls.length).toEqual(0);
    });
  });
});
