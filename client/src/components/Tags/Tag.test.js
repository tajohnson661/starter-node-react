import React from 'react';
import { shallow } from 'enzyme';

import { Tag } from './Tag';  // The component not connected to redux

describe('components', () => {
  describe('Tag', () => {
    it('renders without crashing', () => {
      shallow(<Tag />);
    });
  });
});
