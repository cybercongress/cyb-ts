import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { SenseApi } from 'src/contexts/backend/services/senseApi';
import {
  SenseLinkResultMeta,
  SenseListItem,
  SenseTransactionResultMeta,
  SenseUnread,
} from 'src/services/backend/types/sense';
import { isParticle } from '../../particle/utils';
import { SenseItemId } from '../types/sense';
import { EntryType } from 'src/services/CozoDb/types/entities';
import {
  MsgMultiSendValue,
  MsgSendValue,
} from 'src/services/backend/services/indexer/types';
import { RootState } from 'src/redux/store';

// similar to blockchain/tx/message type
export type SenseItem = {
  id: SenseItemId;
  transactionHash: string;

  // add normal type
  type: string;

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
  summary: {
    unreadCount: {
      total: number;
      particles: number;
      neurons: number;
    };
  };
};

const initialState: SliceState = {
  list: {
    isLoading: false,
    data: [],
    error: undefined,
  },
  chats: {},
  summary: {
    unreadCount: {
      total: 0,
      particles: 0,
      neurons: 0,
    },
  },
};

function formatDate(timestamp: number) {
  return new Date(
    timestamp + -new Date().getTimezoneOffset() * 60 * 1000
  ).toISOString();
}

function formatApiData(item: SenseListItem): SenseItem {
  if (item.entryType === EntryType.chat && item.meta.to) {
    item.entryType = EntryType.particle;
  }

  switch (item.entryType) {
    case EntryType.chat:
    case EntryType.transactions: {
      const meta = item.meta as SenseTransactionResultMeta;
      const { type } = meta;

      let from = item.ownerId;

      if (type === 'cosmos.bank.v1beta1.MsgSend') {
        const value = meta.value as MsgSendValue;
        from = value.from_address;
      } else if (type === 'cosmos.bank.v1beta1.MsgMultiSend') {
        const value = meta.value as MsgMultiSendValue;

        from = value.inputs[0].address;
      }

      return {
        id: item.id || from,
        // maybe ISO string better
        timestamp: formatDate(meta.timestamp),
        transactionHash:
          item.transactionHash || item.hash || item.meta.transaction_hash,
        type,
        from,
        meta: item.meta.value,
        memo: item.memo || meta.memo,

        // not good
        unreadCount: item.unreadCount || 0,
      };
    }

    case EntryType.particle: {
      const meta = item.meta as SenseLinkResultMeta;

      return {
        id: item.id || meta.neuron,
        timestamp: formatDate(meta.timestamp),
        transactionHash: meta.transactionHash || meta.transaction_hash,
        type: 'cyber.graph.v1beta1.MsgCyberlink',
        from: meta.neuron,
        meta: item.meta,
        memo: '',

        // not good
        unreadCount: item.unreadCount || 0,
      };
    }

    default:
      debugger;
      return {};
  }
}

const getSenseList = createAsyncThunk(
  'sense/getSenseList',
  async (senseApi: SenseApi) => {
    const data = await senseApi!.getList();
    return data.map(formatApiData);
  }
);

const getSenseChat = createAsyncThunk(
  'sense/getSenseChat',
  async ({ id, senseApi }: { id: SenseItemId; senseApi: SenseApi }) => {
    const particle = isParticle(id);

    if (particle) {
      const links = await senseApi!.getLinks(id);
      const formattedLinks = links.reverse().map((item) => {
        return formatApiData({
          ...item,
          entryType: EntryType.particle,
          meta: item,
        });
      });

      return formattedLinks;
    }

    const data = await senseApi!.getFriendItems(id);
    const formattedData = data.map((item) => {
      const entryType = item.to ? EntryType.particle : EntryType.chat;
      return formatApiData({
        ...item,
        entryType,
        meta: item,
      });
    });

    return formattedData;
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

function checkIfMessageExists(chat: Chat, newMessage: SenseItem) {
  const lastMsg = chat.data[chat.data.length - 1];

  if (newMessage.transactionHash === lastMsg?.transactionHash) {
    return true;
  }

  return false;
}

const slice = createSlice({
  name: 'sense',
  initialState,
  reducers: {
    // backend may push this action
    updateSenseList: {
      reducer: (state, action: PayloadAction<SenseItem[]>) => {
        const data = action.payload;

        data.forEach((message) => {
          const { id } = message;

          if (!state.chats[id]) {
            state.chats[id] = { ...newChatStructure };
          }

          const chat = state.chats[id]!;

          Object.assign(chat, {
            id,
            // fix ts
            unreadCount: message.unreadCount || 0,
          });

          if (!checkIfMessageExists(chat, message)) {
            chat.data = chat.data.concat(message);
          }
        });

        slice.caseReducers.orderSenseList(state);
      },
      prepare: (data: SenseListItem[]) => {
        return {
          payload: data.map(formatApiData),
        };
      },
    },
    // optimistic update
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
    // optimistic confirm/error
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

      const item = chat.data.find((item) => item.transactionHash === txHash);

      if (item) {
        if (isSuccess) {
          delete item.status;
        } else {
          item.status = 'error';
        }
      }
    },
    orderSenseList(state) {
      const temp: {
        id: string;
        lastMsg: SenseItem;
      }[] = Object.keys(state.chats).map((id) => {
        return {
          id,
          lastMsg: state.chats[id]!.data[state.chats[id]!.data.length - 1],
        };
      });

      const sorted = temp.sort((a, b) => {
        return (
          Date.parse(b.lastMsg.timestamp) - Date.parse(a.lastMsg.timestamp)
        );
      });

      state.list.data = sorted.map((i) => i.id);
    },
    reset() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getSenseList.pending, (state) => {
      state.list.isLoading = true;
    });

    builder.addCase(getSenseList.fulfilled, (state, action) => {
      state.list.isLoading = false;

      const newList: SliceState['list']['data'] = [];

      action.payload.forEach((message) => {
        const { id } = message;

        if (!state.chats[id]) {
          state.chats[id] = { ...newChatStructure };
        }

        const chat = state.chats[id]!;

        Object.assign(chat, {
          id,
          // fix
          unreadCount: message.unreadCount || 0,
        });

        if (!checkIfMessageExists(chat, message)) {
          chat.data = chat.data.concat(message);
        }

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
      const { id } = action.meta.arg;

      if (!state.chats[id]) {
        state.chats[id] = { ...newChatStructure };
      }

      // don't understand why ts warning
      state.chats[id].isLoading = true;
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
    // can be optimistic
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const chat = state.chats[id]!;

      const particle = isParticle(id);

      const { unreadCount } = chat;

      state.summary.unreadCount.total -= unreadCount;
      if (particle) {
        state.summary.unreadCount.particles -= unreadCount;
      } else {
        state.summary.unreadCount.neurons -= unreadCount;
      }

      chat.unreadCount = 0;
    });
  },
});

const selectUnreadCounts = createSelector(
  (state: RootState) => state.sense.chats,
  (chats) => {
    let unreadCountParticle = 0;
    let unreadCountNeuron = 0;

    Object.values(chats).forEach(({ id, unreadCount }) => {
      const particle = isParticle(id);

      if (particle) {
        unreadCountParticle += unreadCount;
      } else {
        unreadCountNeuron += unreadCount;
      }
    });

    const total = unreadCountParticle + unreadCountNeuron;

    return {
      total,
      particles: unreadCountParticle,
      neurons: unreadCountNeuron,
    };
  }
);

export const { addSenseItem, updateSenseItem, updateSenseList, reset } =
  slice.actions;

export { getSenseList, getSenseChat, markAsRead };

// selectors
export { selectUnreadCounts };

export default slice.reducer;
