import React from 'react';
import { shallow } from 'enzyme';

import { Signout } from './Signout';  // The component not connected to redux

describe('components', () => {
  describe('Signout', () => {
    it('renders without crashing', () => {
      shallow(<Signout />);
    });
  });
});
