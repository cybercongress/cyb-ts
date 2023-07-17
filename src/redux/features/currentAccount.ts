import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type SliceState = {
  community: {
    following: any[];
    followers: any[];
    friends: any[];
  };
};

const initialState: SliceState = {
  community: {
    following: [],
    followers: [],
    friends: [],
  },
};

const slice = createSlice({
  name: 'currentAccount',
  initialState,
  reducers: {
    // fix type
    setCommunity: (
      state,
      { payload }: PayloadAction<SliceState['community']>
    ) => {
      state.community = payload;
    },
  },
});

export const { setCommunity } = slice.actions;

export default slice.reducer;
