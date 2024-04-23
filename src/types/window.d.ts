import { ExternalProvider } from '@ethersproject/providers';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {
    ethereum?: ExternalProvider;

    // for our window things
    cyb: any;
  }
}
