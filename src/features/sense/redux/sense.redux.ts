import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SenseApi } from 'src/contexts/backend';
import { SenseListItem, SenseMetaType } from 'src/services/backend/types/sense';
import { isParticle } from '../../particle/utils';
import { SenseItemId } from '../types/sense';

export type SenseItem = {
  id: SenseItemId;
  hash: string;
  itemType: SenseMetaType;
  meta: SenseListItem['meta'];
  timestamp: string;
  memo: string | undefined;
  from: string;

  // for optimistic update
  status?: 'pending' | 'error';
};

type Chat = {
  id: SenseItemId;
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
    [key in SenseItemId]?: Chat;
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
};

function formatAPIChatListData(item: SenseListItem): SenseItem {
  return {
    ...item,
    timestamp: item.timestampUpdate,
    hash: item.transactionHash || item.hash || item.lastId,
    itemType: item.meta.meta_type,
    entryType: item.entryType,
    meta: item.meta || item.value,
    memo: item.meta.memo || '',
  };
}

const getSenseList = createAsyncThunk(
  'sense/getSenseList',
  async (senseApi: SenseApi) => {
    return (await senseApi!.getList()).map(formatAPIChatListData);
  }
);

const getSenseChat = createAsyncThunk(
  'sense/getSenseChat',
  async ({ id, senseApi }: { id: SenseItemId; senseApi: SenseApi }) => {
    const particle = isParticle(id);

    if (particle) {
      return (await senseApi!.getLinks(id))
        .map((item) => {
          return {
            ...item,
            from: item.neuron,
            id: {
              text: item.text,
            },
            hash: item.hash || item.transactionHash,
            itemType: item.itemType || SenseMetaType.particle,
            memo: item.text,
          };
        })
        .reverse();
    }

    return (await senseApi!.getFriendItems(id)).map((item) => {
      return {
        ...item,
        hash: item.hash || item.transactionHash,
        meta: item.meta || item.value,
      };
    });
  }
);

const markAsRead = createAsyncThunk(
  'sense/markAsRead',
  async ({ id, senseApi }: { id: SenseItemId; senseApi: SenseApi }) => {
    return senseApi!.markAsRead(id);
  }
);

const newChatStructure: Chat = {
  id: '',
  isLoading: false,
  data: [],
  error: undefined,
  unreadCount: 0,
};

const slice = createSlice({
  name: 'sense',
  initialState,
  reducers: {
    updateSenseList(state, action: PayloadAction<SenseListItem[]>) {
      const data = action.payload;

      const newList: SliceState['list']['data'] = [];

      data.forEach((item) => {
        const { id } = item;

        // TODO: remove
        if (newList.includes(id)) {
          return;
        }

        if (!state.chats[id]) {
          state.chats[id] = newChatStructure;
        }

        const chat = state.chats[id]!;

        chat.id = id;
        chat.unreadCount = item.unreadCount;

        // TODO: check if message already exists
        chat.data = [...chat.data, formatAPIChatListData(item)];

        newList.push(id);
      });

      state.list.data = newList;
    },

    addSenseItem(
      state,
      action: PayloadAction<{ id: SenseItemId; item: SenseItem }>
    ) {
      const { id, item } = action.payload;
      const chat = state.chats[id]!;

      chat.data.push({
        ...item,
        meta: item.meta,
        status: 'pending',
      });

      const newList = state.list.data.filter((item) => item !== id);
      newList.unshift(id);
      state.list.data = newList;
    },

    updateSenseItem(
      state,
      action: PayloadAction<{
        chatId: SenseItemId;
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

        // TODO: remove
        if (newList.includes(id)) {
          return;
        }

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

export const { addSenseItem, updateSenseItem, updateSenseList } = slice.actions;

export { getSenseList, getSenseChat, markAsRead };

export default slice.reducer;
