import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    clearUserData: (state) => {
      (state.userData = null), (state.loading = true);
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
