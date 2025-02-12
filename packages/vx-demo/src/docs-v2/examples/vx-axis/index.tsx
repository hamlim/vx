import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@vx/responsive/lib/components/ParentSize';

import Example from './Example';
import './styles.css';

render(
  <ParentSize>{({ width, height }) => <Example width={width} height={height} />}</ParentSize>,
  document.getElementById('root'),
);
