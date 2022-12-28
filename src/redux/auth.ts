import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  user: {
    id: string;
    role: string;
    email: string;
  };
  msg: string;
}

const initialState: authState = {
  user: {
    id: "",
    role: "",
    email: "",
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
      state.msg = payload.msg;
    },
    updateMsg(state, action: PayloadAction<authState>) {
      state.msg = action.payload.msg;
    },
  },
});

export const { updateDetails, updateMsg } = authSlice.actions;

export default authSlice.reducer;
