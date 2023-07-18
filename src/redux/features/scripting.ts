/* eslint-disable camelcase */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  WebLLMInstance,
  LLMParams,
  LLMParamsMap,
} from 'src/services/scripting/webLLM';
import { TabularKeyValues } from 'src/types/data';
import {
  loadJsonFromLocalStorage,
  saveJsonToLocalStorage,
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
  keyValuesToObject,
} from 'src/utils/localStorage';
import {
  ScriptEntrypoint,
  ScriptItem,
} from 'src/services/scripting/scritpting';
import { appBus } from 'src/services/scripting/bus';

import scriptParticleDefault from 'src/services/scripting/scripts/default/particle.rn';
import scriptParticleRuntime from 'src/services/scripting/scripts/runtime/particle.rn';

type ChatBotStatus = 'on' | 'off' | 'loading' | 'error';

type SliceState = {
  secrets: TabularKeyValues;
  scripts: {
    entrypoints: Record<ScriptEntrypoint, ScriptItem>;
  };
  chatBot: {
    name: string;
    active: boolean;
    status: ChatBotStatus;
    loadProgress: number;
    chatBotList: LLMParamsMap;
  };
};

const scriptEntrypoints: Record<ScriptEntrypoint, ScriptItem> = {
  particle: {
    title: 'Particle post-processor',
    runtime: scriptParticleRuntime,
    user: loadStringFromLocalStorage('particle', scriptParticleDefault),
  },
  'my-particle': {
    title: 'My particle',
    runtime: scriptParticleRuntime,
    user: loadStringFromLocalStorage('my-particle', scriptParticleDefault),
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

WebLLMInstance.updateConfig(chatBotList);

const botName =
  loadStringFromLocalStorage('activeBotName') ||
  Object.values(chatBotList)?.[0]?.name ||
  '';

const initialState: SliceState = {
  secrets: loadJsonFromLocalStorage('secrets', {}),
  scripts: {
    entrypoints: scriptEntrypoints,
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
      WebLLMInstance.updateConfig(payload);
    },
    setChatBotActive: (state, { payload }: PayloadAction<boolean>) => {
      state.chatBot.active = payload;
      if (payload) {
        state.chatBot.status = 'loading';
        WebLLMInstance.load(state.chatBot.name, onProgress).then(() =>
          setStatus('on')
        );
      } else {
        state.chatBot.status = 'off';
        WebLLMInstance.unload();
      }
    },
    setChatBotLoadProgress: (
      state,
      { payload }: PayloadAction<{ progress: number }>
    ) => {
      state.chatBot.loadProgress = payload.progress;
      // if (payload.progress >= 1) {
      //   state.chatBot.status = 'on';
      // }
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
      appBus.emit('context', {
        name: 'secrets',
        item: keyValuesToObject(Object.values(payload)),
      });
      state.secrets = payload;
    },
    setScript: (
      state,
      { payload }: PayloadAction<{ name: ScriptEntrypoint; code: string }>
    ) => {
      const { name, code } = payload;
      saveStringToLocalStorage(name, code);
      state.scripts.entrypoints[name].user = code;
    },
  },
});

const setStatus = (status: ChatBotStatus) =>
  window.store.dispatch(slice.actions.setChatBotStatus(status));
const onProgress = ({ progress }) =>
  window.store.dispatch(slice.actions.setChatBotLoadProgress({ progress }));

export const {
  setChatBotList,
  setChatBotActive,
  setChatBotName,
  setSecrets,
  setScript,
} = slice.actions;

export default slice.reducer;
