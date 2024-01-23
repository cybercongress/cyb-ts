import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NeuronAddress } from 'src/types/base';
import { SenseApi } from 'src/contexts/backend';
import { SenseListItem, SenseMetaType } from 'src/services/backend/types/sense';
import { isParticle } from '../particles/utils';

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
  summary: {};
};

const initialState: SliceState = {
  list: {
    isLoading: false,
    data: [],
    error: undefined,
  },
  chats: {},
  summary: {},
};

// export function getCommunityPassports(queryClient: CyberClient): AppThunk {
//   return (dispatch, getState) => {
//     const { currentAccount, passports } = getState();
//     const { following, followers, friends } = currentAccount.community;
//     [...friends, ...following, ...followers].forEach((address) => {
//       const passport = passports[address];
//       if (!passport?.data && !passport?.loading) {
//         dispatch(getPassport({ address, queryClient }));
//       }
//     });
//   };
// }

const getSenseList = createAsyncThunk(
  'sense/getSenseList',
  async (senseApi: SenseApi) => {
    return senseApi!.getList();
  }
);

const getSenseChat = createAsyncThunk(
  'sense/getSenseChat',
  async ({ id, senseApi }: { id: SenseChatId; senseApi: SenseApi }) => {
    const particle = isParticle(id);

    if (particle) {
      return senseApi!.getLinks(id);
    }

    return senseApi!.getFriendItems(id);
  }
);

const slice = createSlice({
  name: 'sense',
  initialState,
  reducers: {
    // addAddress: (
    //   state,
    //   {
    //     payload: { address, currentAddress },
    //   }: PayloadAction<{
    //     address: string;
    //     currentAddress: string;
    //   }>
    // ) => {
    //   if (
    //     !(
    //       state[currentAddress]?.data &&
    //       state[currentAddress].data.extension.addresses
    //     )
    //   ) {
    //     return;
    //   }
    //   state[currentAddress].data.extension.addresses.push({
    //     label: null,
    //     address,
    //   });
    // },
  },
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
          data: [
            {
              ...item,
              // TODO: fix
              timestamp: item.timestampUpdate,
              hash: item.lastId,
              itemType: item.meta.meta_type,
              value: item.meta,
              memo: item.meta.memo || '',
            },
          ],
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
  },
});

export const {} = slice.actions;

export { getSenseList, getSenseChat };

export default slice.reducer;
