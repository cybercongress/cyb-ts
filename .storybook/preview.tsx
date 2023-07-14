import type { Preview } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import IbcDenomProvider from '../src/contexts/ibcDenom';
import SdkQueryClientProvider from '../src/contexts/queryClient';

import '../src/style/main.css';
import '../src/style/index.scss';
import './styles.scss';

// storybook error that React not defined, may be fixed in future
import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
window.React = React;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: 60 * 1000,
    },
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: true,
      value: '#000',
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
          <SdkQueryClientProvider>
            <QueryClientProvider client={queryClient}>
              <IbcDenomProvider>
                <Story />
              </IbcDenomProvider>
            </QueryClientProvider>
          </SdkQueryClientProvider>
        </BrowserRouter>
      </div>
    ),
  ],
};

export default preview;
