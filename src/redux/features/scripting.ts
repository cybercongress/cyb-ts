/* eslint-disable camelcase */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WebLLMInstance } from 'src/services/scripting/webLLM';
import { TabularKeyValues } from 'src/types/data';
import {
  STORAGE_KEYS,
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from 'src/utils/localStorage';
import { AppConfig } from '@mlc-ai/web-llm';

type ChatBotStatus = 'on' | 'off' | 'loading' | 'error';
type SliceState = {
  secrets: TabularKeyValues;
  chatBot: {
    name: string;
    active: boolean;
    status: ChatBotStatus;
    loadProgress: number;
    chatBotList: TabularKeyValues;
  };
};

const initialBotList = {
  '0': {
    name: 'vicuna-v1-7b-q4f32_0',
    model_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm',
    params_url:
      'https://huggingface.co/mlc-ai/mlc-chat-vicuna-v1-7b-q4f32_0/resolve/main/',
  },
  '1': {
    name: 'RedPajama-INCITE-Chat-3B-v1-q4f32_0',
    model_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_0-webgpu.wasm',
    params_url:
      'https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/',
  },
};

const botListToWebLLMConfig = (botList: TabularKeyValues): AppConfig => {
  const items = Object.values(botList);
  const model_lib_map = Object.fromEntries(
    items.map((i) => [i.name, i.model_url])
  );
  const model_list = items.map((i) => ({
    model_url: i.params_url,
    local_id: i.name,
  }));
  return { model_lib_map, model_list };
};

const chatBotList = loadDataFromLocalStorage(
  STORAGE_KEYS.botConfig,
  initialBotList
);

WebLLMInstance.updateConfig(botListToWebLLMConfig(chatBotList));

const botName =
  localStorage.getItem(STORAGE_KEYS.activeBotName) ||
  Object.values(chatBotList)?.[0]?.name ||
  '';

const initialState: SliceState = {
  secrets: loadDataFromLocalStorage(STORAGE_KEYS.secrets, {}),
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
    setChatBotList: (state, { payload }: PayloadAction<TabularKeyValues>) => {
      saveDataToLocalStorage(STORAGE_KEYS.botConfig, payload);
      state.chatBot.chatBotList = payload;
      WebLLMInstance.updateConfig(botListToWebLLMConfig(payload));
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
      localStorage.setItem(STORAGE_KEYS.activeBotName, payload);
      state.chatBot.name = payload;
    },
    setSecrets: (state, { payload }: PayloadAction<TabularKeyValues>) => {
      saveDataToLocalStorage(STORAGE_KEYS.secrets, payload);
      state.secrets = payload;
    },
  },
});

export const { setChatBotList, setChatBotActive, setChatBotName, setSecrets } =
  slice.actions;

const setStatus = (status: ChatBotStatus) =>
  window.store.dispatch(slice.actions.setChatBotStatus(status));
const onProgress = ({ progress }) =>
  window.store.dispatch(slice.actions.setChatBotLoadProgress({ progress }));
export default slice.reducer;
