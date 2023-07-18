/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unused-modules */
import { CyberClient, SigningCyberClient } from '@cybercongress/cyber-js';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import {
  loadJsonFromLocalStorage,
  keyValuesToObject,
} from 'src/utils/localStorage';

import { eventbus } from '../eventbus';
import store from 'src/redux/store';
import { RootState } from 'src/redux/store';
import { from, Observable, distinctUntilChanged, map } from 'rxjs';
import { ScriptEntrypoint, ScriptItem } from './scritpting';
import { Citizenship } from 'src/types/citizenship';

type AppDependencies = CyberClient | AppIPFS;
type AppDependencyNames = 'ipfs' | 'queryClient' | 'signer';

// private executing: Record<QueueSource, Set<string>> = {
//     db: new Set(),
//     node: new Set(),
//     gateway: new Set(),
//   };

type ContextItemType = string | Record<string, string> | string[] | Citizenship;

type BusInitPayload =
  | { name: 'ipfs'; item: AppIPFS }
  | { name: 'queryClient'; item: CyberClient }
  | {
      name: 'signer';
      item: { signer?: OfflineSigner; signingClient: SigningCyberClient };
    };

type BusContextPayload = {
  name: 'params' | 'secrets' | 'user';
  item: Record<string, ContextItemType>;
};

export const appBus = eventbus<{
  init: (payload: BusInitPayload) => void;
  context: (payload: BusContextPayload) => void;
}>();

export class ContextManager {
  private _deps: Record<AppDependencyNames, AppDependencies> = {};

  private _context: Record<string, Record<string, ContextItemType>> = {};

  private _entrypoints: Record<ScriptEntrypoint, ScriptItem> = {};

  private _state$: Observable<RootState> = from(store);

  public get deps() {
    // Return a copy of the deps object
    return { ...this._deps };
  }

  public get context() {
    return this._context;
  }

  public get entrypoints() {
    return this._entrypoints;
  }

  constructor() {
    console.log('--------bus store', store.getState(), this._state$);

    this._state$
      .pipe(
        map((state: RootState) => state.scripting.secrets),
        distinctUntilChanged()
      )
      .subscribe((secrets) => {
        this._context.secrets = keyValuesToObject(Object.values(secrets));
      });

    this._state$
      .pipe(
        map((state: RootState) => state.scripting.scripts.entrypoints),
        distinctUntilChanged()
      )
      .subscribe((entrypoints) => {
        console.log('----entrypoints', entrypoints);
        this._entrypoints = entrypoints;
      });

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
