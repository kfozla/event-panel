import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsersList,
  getUserByIdList,
  addUserList,
  updateUserList,
  deleteUserList,
  getUserMediaCountList,
  getUserMediaListById,
} from "./thunk";
export const initialState = {
  userLists: [],
  error: {},
};

const UsersSlice = createSlice({
  name: "UsersSlice",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsersList.fulfilled, (state, action) => {
      state.userLists = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(getAllUsersList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getUserByIdList.fulfilled, (state, action) => {
      const user = action.payload;
      const existingUser = state.userLists.find((e) => e.id === user.id);
      if (existingUser) {
        Object.assign(existingUser, user);
      } else {
        state.userLists.push(user);
      }
    });
    builder.addCase(getUserByIdList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(addUserList.fulfilled, (state, action) => {
      state.userLists.push(action.payload);
    });
    builder.addCase(addUserList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(updateUserList.fulfilled, (state, action) => {
      state.userLists = state.userLists.map((user) =>
        user.id.toString() === action.payload.id.toString()
          ? { ...user, ...action.payload }
          : user
      );
    });
    builder.addCase(updateUserList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(deleteUserList.fulfilled, (state, action) => {
      state.userLists = state.userLists.filter(
        (user) => user.id !== action.payload
      );
    });
    builder.addCase(deleteUserList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getUserMediaCountList.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      const user = state.userLists.find((u) => u.id === userId);
      if (user) {
        user.mediaCount = action.payload.data;
      }
    });
    builder.addCase(getUserMediaCountList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getUserMediaListById.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      const user = state.userLists.find((u) => u.id === userId);
      if (user) {
        user.mediaList = action.payload.data || [];
      }
    });
    builder.addCase(getUserMediaListById.rejected, (state, action) => {
      state.error = action.payload || null;
    });
  },
});

export default UsersSlice.reducer;
