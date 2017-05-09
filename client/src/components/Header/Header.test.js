import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';

import ConnectedHeader, { Header } from './Header';

const setupStore = (authenticated) => {
  const initialState = {
    auth: {
      authenticated
    }
  };
  const mockStore = configureStore();
  return mockStore(initialState);
};

describe('components', () => {
  describe('<Header />', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<Header />);
      expect(wrapper.length).toBeTruthy();
    });

    it('should render self and subcomponents', () => {
      const wrapper = shallow(<Header />);
      expect(wrapper.find(Toolbar)).toHaveLength(1);
      expect(wrapper.find(ToolbarGroup)).toHaveLength(2);
    });
  });

  describe('<ConnectedHeader />', () => {
    it('should render the ConnectedHeader component', () => {
      const store = setupStore(true);
      const wrapper = shallow(<ConnectedHeader store={store} />);
      expect(wrapper.length).toEqual(1);
    });

    it('should check Prop matches with initialState', () => {
      const store = setupStore(true);
      const wrapper = shallow(<ConnectedHeader store={store} />);
      expect(wrapper.prop('authenticated')).toEqual(true);
    });

    it('should show proper menu items for logged in user', () => {
      const store = setupStore(true);
      const wrapper = shallow(<ConnectedHeader store={store} />);
      expect(wrapper.find(Header).shallow().find(MenuItem)).toHaveLength(6);
      const data = wrapper.find(Header).shallow().find(MenuItem).map(node => node.props().primaryText);
      expect(data).toContain('Sign out');
      expect(data).toContain('Notes');
      expect(data).toContain('Tags');
      expect(data).not.toContain('Sign in');
      expect(data).not.toContain('Sign up');
    });

    it('should show proper menu items for logged out user', () => {
      const store = setupStore(false);
      const wrapper = shallow(<ConnectedHeader store={store} />);
      const data = wrapper.find(Header).shallow().find(MenuItem).map(node => node.props().primaryText);
      expect(data).not.toContain('Sign out');
      expect(data).not.toContain('Notes');
      expect(data).not.toContain('Tags');
      expect(data).toContain('Sign in');
      expect(data).toContain('Sign up');
    });
  });
});
