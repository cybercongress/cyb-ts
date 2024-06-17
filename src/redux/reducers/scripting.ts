/* eslint-disable camelcase */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  loadJsonFromLocalStorage,
  saveJsonToLocalStorage,
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
  getEntrypointKeyName,
} from 'src/utils/localStorage';

import {
  ScriptEntrypointNames,
  ScriptContext,
  ScriptEntrypoints,
} from 'src/services/scripting/types';

import { TabularKeyValues } from 'src/types/data';

import type { AppThunk, SliceActions } from 'src/redux/types';

import defaultParticleScript from 'src/services/scripting/rune/default/particle.rn';
import { RootState } from '../store';

type SliceState = {
  context: ScriptContext; // Omit<ScriptContext, 'secrets' | 'user'>;
  scripts: {
    entrypoints: ScriptEntrypoints;
  };
};

const particleEnabled = loadStringFromLocalStorage(
  getEntrypointKeyName('particle', 'enabled'),
  undefined
);

const isParticleScriptEnabled =
  particleEnabled !== undefined ? !!particleEnabled : true;

console.log('----isParticleScriptEnabled', isParticleScriptEnabled);

const initialScriptEntrypoints: ScriptEntrypoints = {
  particle: {
    title: 'Personal processor',
    script: loadStringFromLocalStorage('particle', defaultParticleScript),
    enabled: !!isParticleScriptEnabled,
  },
  // myParticle: {
  //   title: 'Social inference',
  //   script: '',
  //   enabled: true,
  // },
};

const initialState: SliceState = {
  context: {
    secrets: loadJsonFromLocalStorage('secrets', {}) as TabularKeyValues,
    params: {},
    user: {},
  },
  scripts: {
    entrypoints: initialScriptEntrypoints,
  },
};

export function setSecrets(secrets: TabularKeyValues): AppThunk {
  return (dispatch) => {
    saveJsonToLocalStorage('secrets', secrets);
    dispatch(setContext({ name: 'secrets', item: secrets }));
  };
}

const slice = createSlice({
  name: 'scripting',
  initialState,
  reducers: {
    setContext: (
      state,
      {
        payload,
      }: PayloadAction<{
        name: keyof ScriptContext;
        item: ScriptContext[keyof ScriptContext];
      }>
    ) => {
      state.context = { ...state.context, [payload.name]: payload.item };
    },
    setEntrypoint: (
      state,
      { payload }: PayloadAction<{ name: ScriptEntrypointNames; code: string }>
    ) => {
      const { name, code } = payload;
      if (code) {
        state.scripts.entrypoints[name].script = code;
      }
    },
    setEntrypointEnabled: (
      state,
      {
        payload,
      }: PayloadAction<{ name: ScriptEntrypointNames; enabled: boolean }>
    ) => {
      const { name, enabled } = payload;
      saveStringToLocalStorage(
        getEntrypointKeyName(name, 'enabled'),
        enabled ? 'true' : ''
      );

      state.scripts.entrypoints[name].enabled = enabled;
    },
  },
});

export const selectRuneEntypoints = (store: RootState) =>
  store.scripting.scripts.entrypoints;

export type ScriptingActionTypes = SliceActions<typeof slice.actions>;

export const { setEntrypoint, setEntrypointEnabled, setContext } =
  slice.actions;

export default slice.reducer;
