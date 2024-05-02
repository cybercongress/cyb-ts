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
  TabularKeyValues,
} from 'src/services/scripting/types';

import type { AppThunk, SliceActions } from 'src/redux/types';

import defaultParticleScript from 'src/services/scripting/rune/default/particle.rn';

type SliceState = {
  context: ScriptContext; // Omit<ScriptContext, 'secrets' | 'user'>;
  scripts: {
    entrypoints: ScriptEntrypoints;
  };
};

const isParticleScriptEnabled =
  !!loadStringFromLocalStorage(getEntrypointKeyName('particle', 'enabled')) ||
  true;

const initialScriptEntrypoints: ScriptEntrypoints = {
  particle: {
    title: 'Personal processor',
    script: defaultParticleScript,
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

export type ScriptingActionTypes = SliceActions<typeof slice.actions>;

export const { setEntrypoint, setEntrypointEnabled, setContext } =
  slice.actions;

export default slice.reducer;
