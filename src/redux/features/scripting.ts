/* eslint-disable camelcase */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LLMParamsMap } from 'src/services/scripting/webLLM';
import { TabularKeyValues } from 'src/types/data';
import {
  loadJsonFromLocalStorage,
  saveJsonToLocalStorage,
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
} from 'src/utils/localStorage';

import { scriptMap } from 'src/services/scripting/scripts/mapping';

import {
  ScriptEntrypointNames,
  ScriptContext,
  ScriptEntrypoints,
} from 'src/types/scripting';

import type { SliceActions } from '../types';

type ChatBotStatus = 'on' | 'off' | 'loading' | 'error';

type SliceState = {
  context: ScriptContext; // Omit<ScriptContext, 'secrets' | 'user'>;
  scripts: {
    isLoaded: boolean;
    entrypoints: ScriptEntrypoints;
  };
  chatBot: {
    name: string;
    active: boolean;
    status: ChatBotStatus;
    loadProgress: number;
    chatBotList: LLMParamsMap;
  };
};

export type ChatBotActiveAction = PayloadAction<boolean>;

// const loadScript(name: ScriptEntrypointNames, deps: {ipfs: AppIPFS, queryClient: })

const ScriptEntrypointsData: ScriptEntrypoints = {
  particle: {
    title: 'Particle post-processor',
    runtime: scriptMap.particle.runtime,
    user: scriptMap.particle.user,
  },
  myParticle: {
    title: 'My particle',
    runtime: scriptMap.myParticle.runtime,
    user: '',
  },
};

const initialBotList: LLMParamsMap = {
  '0': {
    name: 'vicuna-v1-7b-q4f32_0',
    modelUrl:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm',
    paramsUrl:
      'https://huggingface.co/mlc-ai/mlc-chat-vicuna-v1-7b-q4f32_0/resolve/main/',
  },
  '1': {
    name: 'RedPajama-INCITE-Chat-3B-v1-q4f32_0',
    modelUrl:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_0-webgpu.wasm',
    paramsUrl:
      'https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/',
  },
};

const chatBotList = loadJsonFromLocalStorage('botConfig', initialBotList);

const botName =
  loadStringFromLocalStorage('activeBotName') ||
  Object.values(chatBotList)?.[0]?.name ||
  '';

const initialState: SliceState = {
  context: {
    secrets: loadJsonFromLocalStorage('secrets', {}) as TabularKeyValues,
    params: {},
    user: {},
  },
  scripts: {
    isLoaded: false,
    entrypoints: ScriptEntrypointsData,
  },
  chatBot: {
    name: botName,
    active: false,
    chatBotList,
    status: 'off',
    loadProgress: 0,
  },
};

const slice = createSlice({
  name: 'scripting',
  initialState,
  reducers: {
    setChatBotList: (state, { payload }: PayloadAction<LLMParamsMap>) => {
      saveJsonToLocalStorage('botConfig', payload);
      state.chatBot.chatBotList = payload;
    },
    setChatBotActive: (state, { payload }: ChatBotActiveAction) => {
      state.chatBot.active = payload;
      if (payload) {
        state.chatBot.status = 'loading';
      } else {
        state.chatBot.status = 'off';
      }
    },
    setChatBotLoadProgress: (
      state,
      { payload }: PayloadAction<{ progress: number }>
    ) => {
      state.chatBot.loadProgress = payload.progress;
    },
    setChatBotStatus: (state, { payload }: PayloadAction<ChatBotStatus>) => {
      state.chatBot.status = payload;
    },
    setChatBotName: (state, { payload }: PayloadAction<string>) => {
      saveStringToLocalStorage('activeBotName', payload);
      state.chatBot.name = payload;
    },
    setSecrets: (state, { payload }: PayloadAction<TabularKeyValues>) => {
      saveJsonToLocalStorage('secrets', payload);
      setContext({ name: 'secrets', item: payload });
    },
    setContext: (
      state,
      {
        payload,
      }: PayloadAction<{
        name: keyof ScriptContext;
        item: ScriptContext[keyof ScriptContext];
      }>
    ) => {
      state.context[payload.name] = payload.item;
    },
    setScript: (
      state,
      { payload }: PayloadAction<{ name: ScriptEntrypointNames; code: string }>
    ) => {
      const { name, code } = payload;
      // saveStringToLocalStorage(name, code);
      state.scripts.entrypoints[name].user = code;
    },
    setScriptingEngineLoaded: (state, { payload }: PayloadAction<boolean>) => {
      state.scripts.isLoaded = payload;
    },
  },
});

export type ScriptingActionTypes = SliceActions<typeof slice.actions>;

export const {
  setChatBotList,
  setChatBotActive,
  setChatBotName,
  setSecrets,
  setScript,
  setContext,
  setScriptingEngineLoaded,
  setChatBotStatus,
  setChatBotLoadProgress,
} = slice.actions;

export default slice.reducer;
