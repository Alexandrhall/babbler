import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  user: {
    id: string;
    role: string;
    email: string;
    username: string;
  };
  msg: string;
}

export const initialState: authState = {
  user: {
    id: "",
    role: "",
    email: "",
    username: "",
  },
  msg: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Detta fungerar enbart genom toolkit
    updateDetails(state, { payload }: PayloadAction<authState>) {
      state.user.id = payload.user.id;
      state.user.role = payload.user.role;
      state.user.email = payload.user.email;
      state.user.username = payload.user.username;
      state.msg = payload.msg;
    },
    updateMsg(state, action: PayloadAction<authState>) {
      state.msg = action.payload.msg;
    },
  },
});

export const { updateDetails, updateMsg } = authSlice.actions;

export default authSlice.reducer;
