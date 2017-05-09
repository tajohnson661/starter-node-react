import React from 'react';
import { shallow } from 'enzyme';

import { Tags } from './Tags';  // The component not connected to redux

describe('components', () => {
  describe('Tags', () => {
    it('renders without crashing', () => {
      shallow(<Tags />);
    });
  });
});
