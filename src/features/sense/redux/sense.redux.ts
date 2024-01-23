import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NeuronAddress } from 'src/types/base';
import { SenseApi } from 'src/contexts/backend';
import { SenseListItem, SenseMetaType } from 'src/services/backend/types/sense';
import { isParticle } from '../../particles/utils';

type SenseChatId = NeuronAddress | string;

export type SenseItem = {
  id: string;
  hash: string;
  meta: SenseListItem['meta'];
  timestamp: string;
  itemType: SenseMetaType;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSenseList.pending, (state) => {
      state.list.isLoading = true;
    });

    builder.addCase(getSenseList.fulfilled, (state, action) => {
      state.list.isLoading = false;

      action.payload.forEach((item) => {
        const { id } = item;

        if (state.list.data.includes(id)) {
          return;
        }

        state.chats[id] = {
          id,
          isLoading: false,
          error: undefined,
          data: [item],
          unreadCount: item.unreadCount,
        };

        state.list.data.push(id);
      });
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

// export const {} = slice.actions;

export { getSenseList, getSenseChat, markAsRead };

export default slice.reducer;
