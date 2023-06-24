/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unused-modules */
import { CyberClient } from '@cybercongress/cyber-js';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { eventbus } from '../eventbus';

type AppDependencies = CyberClient | AppIPFS;
type AppDependencyNames = 'ipfs' | 'cyberClient';

// private executing: Record<QueueSource, Set<string>> = {
//     db: new Set(),
//     node: new Set(),
//     gateway: new Set(),
//   };

type ContextItemType = string | Record<string, string> | string[];

type BusInitPayload =
  | { name: 'ipfs'; item: AppIPFS }
  | { name: 'cyberClient'; item: CyberClient };

type BusContextPayload = {
  name: 'params';
  item: Record<string, ContextItemType>;
};

export const appBus = eventbus<{
  init: (payload: BusInitPayload) => void;
  context: (payload: BusContextPayload) => void;
}>();

export class ContextManager {
  private _deps: Record<AppDependencyNames, AppDependencies> = {};

  private _context: Record<string, Record<string, ContextItemType>> = {};

  public get deps() {
    // Return a copy of the deps object
    return { ...this._deps };
  }

  public get context() {
    // Return a copy of the deps object
    return { ...this._context };
  }

  constructor() {
    appBus.on('init', (dep: BusInitPayload) => {
      this.addDep(dep);
    });

    appBus.on('context', (context: BusContextPayload) => {
      this.addContext(context);
    });
  }

  public addDep(dep: BusInitPayload) {
    this._deps[dep.name] = dep.item;
  }

  public addContext(params: BusContextPayload) {
    this._context[params.name] = params.item;
  }
}

export const appContextManager = new ContextManager();

window.ctx = appContextManager;
