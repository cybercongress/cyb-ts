import { Dispatch } from 'redux';
import { localStorageKeys } from 'src/constants/localStorageKeys';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TabularKeyValues } from 'src/types/data';
import {
  STORAGE_KEYS,
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from 'src/utils/localStorage';

type SliceState = {
  secrets: TabularKeyValues;
  chatBot: {
    name?: string;
    active: boolean;
    chatBotList: TabularKeyValues;
  };
};

const initial_bot_list = {
  '0': {
    name: 'vicuna-v1-7b-q4f32_0',
    model_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm',
    params_url:
      'https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/',
  },
  '1': {
    name: 'RedPajama-INCITE-Chat-3B-v1-q4f32_0',
    model_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_0-webgpu.wasm',
    params_url:
      'https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/',
  },
};

const chatBotList = loadDataFromLocalStorage(
  STORAGE_KEYS.botConfig,
  initial_bot_list
);

const botName =
  localStorage.getItem(STORAGE_KEYS.activeBotName) ||
  Object.values(chatBotList)[0]?.name;

const initialState: SliceState = {
  secrets: loadDataFromLocalStorage(STORAGE_KEYS.secrets, {}),
  chatBot: {
    name: botName,
    active: false,
    chatBotList,
  },
};

const slice = createSlice({
  name: 'scripting',
  initialState,
  reducers: {
    setChatBotList: (state, { payload }: PayloadAction<TabularKeyValues>) => {
      saveDataToLocalStorage(STORAGE_KEYS.botConfig, payload);
      state.chatBot.chatBotList = payload;
    },
    setChatBotActive: (state, { payload }: PayloadAction<boolean>) => {
      state.chatBot.active = payload;
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

export default slice.reducer;
