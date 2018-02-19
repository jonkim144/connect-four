import * as React from 'react';
import { shallow } from 'enzyme';
import Board from './Board';

it('renders without crashing', () => {
  shallow(<Board />);
});
