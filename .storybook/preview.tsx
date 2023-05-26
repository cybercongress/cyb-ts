import type { Preview } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import '../src/style/main.css';
import './styles.scss';

// storybook error that React not defined, may be fixed in future
import React from 'react';
window.React = React;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: true,
      value: '#000'
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </div>
    ),
  ],
};

export default preview;
