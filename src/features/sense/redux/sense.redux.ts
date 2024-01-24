import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NeuronAddress } from 'src/types/base';
import { SenseApi } from 'src/contexts/backend';
import { SenseListItem, SenseMetaType } from 'src/services/backend/types/sense';
import { isParticle } from '../../particle/utils';

type SenseChatId = NeuronAddress | string;

export type SenseItem = {
  id: string;
  hash: string;
  meta: SenseListItem['meta'];
  timestamp: string;
  itemType: SenseMetaType;
  memo: string | undefined;
  status?: 'pending' | 'error';
};

type Chat = {
  id: SenseChatId;
  isLoading: boolean;
  error: string | undefined;
  data: SenseItem[];
  unreadCount: number;
};

type SliceState = {
  list: {
    isLoading: boolean;
    data: string[];
    error: string | undefined;
  };
  chats: {
    [key in SenseChatId]?: Chat;
  };
  // summary: {};
};

const initialState: SliceState = {
  list: {
    isLoading: false,
    data: [],
    error: undefined,
  },
  chats: {},
  // summary: {},
};

const getSenseList = createAsyncThunk(
  'sense/getSenseList',
  async (senseApi: SenseApi) => {
    return (await senseApi!.getList()).map((item) => {
      return {
        ...item,
        timestamp: item.timestampUpdate,
        hash: item.lastId || item.transactionHash,
        itemType: item.meta.meta_type,
        value: item.meta,
        memo: item.meta.memo || '',
      };
    });
  }
);

const getSenseChat = createAsyncThunk(
  'sense/getSenseChat',
  async ({ id, senseApi }: { id: SenseChatId; senseApi: SenseApi }) => {
    const particle = isParticle(id);

    if (particle) {
      return (await senseApi!.getLinks(id)).map((item) => {
        return {
          ...item,
          itemType: item.itemType || SenseMetaType.particle,
          memo: item.text,
          hash: item.hash || item.transactionHash,
          id: {
            text: item.text,
          },
        };
      });
    }

    return (await senseApi!.getFriendItems(id)).map((item) => {
      return {
        ...item,
        hash: item.hash || item.transactionHash,
      };
    });
  }
);

const markAsRead = createAsyncThunk(
  'sense/markAsRead',
  async ({ id, senseApi }: { id: SenseChatId; senseApi: SenseApi }) => {
    return senseApi!.markAsRead(id);
  }
);

const slice = createSlice({
  name: 'sense',
  initialState,
  reducers: {
    addSenseItem(
      state,
      action: PayloadAction<{ id: SenseChatId; item: SenseItem }>
    ) {
      const { id, item } = action.payload;
      const chat = state.chats[id]!;

      chat.data.push({
        ...item,
        value: item.meta,
        status: 'pending',
      });

      const newList = state.list.data.filter((item) => item !== id);
      newList.unshift(id);
      state.list.data = newList;
    },

    updateSenseItem(
      state,
      action: PayloadAction<{
        chatId: SenseChatId;
        txHash: string;
        isSuccess: boolean;
      }>
    ) {
      const { chatId, txHash, isSuccess } = action.payload;
      const chat = state.chats[chatId]!;

      const item = chat.data.find((item) => item.hash === txHash);
      if (item) {
        if (isSuccess) {
          delete item.status;
        } else {
          item.status = 'error';
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSenseList.pending, (state) => {
      state.list.isLoading = true;
    });

    builder.addCase(getSenseList.fulfilled, (state, action) => {
      state.list.isLoading = false;

      const newList: SliceState['list']['data'] = [];
      action.payload.forEach((item) => {
        const { id } = item;

        // if (state.list.data.includes(id)) {
        //   return;
        // }

        state.chats[id] = {
          id,
          isLoading: false,
          error: undefined,
          data: [item],
          unreadCount: item.unreadCount,
        };

        newList.push(id);
      });

      state.list.data = newList;
    });
    builder.addCase(getSenseList.rejected, (state, action) => {
      console.error(action);

      state.list.isLoading = false;
      state.list.error = action.error.message;
    });

    builder.addCase(getSenseChat.pending, (state, action) => {
      state.chats[action.meta.arg.id]!.isLoading = true;
    });

    builder.addCase(getSenseChat.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const chat = state.chats[id]!;
      chat.isLoading = false;

      chat.id = id;

      chat.data = action.payload;
    });
    builder.addCase(getSenseChat.rejected, (state, action) => {
      console.error(action);

      const chat = state.chats[action.meta.arg.id]!;
      chat.isLoading = false;
      chat.error = action.error.message;
    });

    // maybe add .pending, .rejected
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const chat = state.chats[id]!;

      chat.unreadCount = 0;
    });
  },
});

export const { addSenseItem, updateSenseItem } = slice.actions;

export { getSenseList, getSenseChat, markAsRead };

export default slice.reducer;
