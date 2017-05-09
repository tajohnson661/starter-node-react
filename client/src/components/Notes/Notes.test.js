import React from 'react';
import { shallow } from 'enzyme';

import { Notes } from './Notes';  // The component not connected to redux

describe('components', () => {
  describe('Notes', () => {
    it('renders without crashing', () => {
      shallow(<Notes />);
    });
  });
});
