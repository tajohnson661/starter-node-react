import React from 'react';
import { shallow } from 'enzyme';

import { Note } from './Note';  // The component not connected to redux

describe('components', () => {
  describe('Note', () => {
    it('renders without crashing', () => {
      shallow(<Note />);
    });
  });
});
