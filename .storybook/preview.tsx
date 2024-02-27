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
import store from '../src/redux/store';
import { Provider } from 'react-redux';
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
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <SdkQueryClientProvider>
                <IbcDenomProvider>
                  <Story />
                </IbcDenomProvider>
              </SdkQueryClientProvider>
            </QueryClientProvider>
          </Provider>
        </BrowserRouter>
      </div>
    ),
  ],
};

export default preview;
