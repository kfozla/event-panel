import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getAllUsers,
  getUserById,
  getUserMediaCount,
  getUserMediaList,
  addUser,
  deleteUser,
  updateUser,
} from "../../api/user";

export const getAllUsersList = createAsyncThunk(
  "events/getAllUsersList",
  async () => {
    try {
      const response = await getAllUsers();

      return response;
    } catch (error) {
      return error;
    }
  }
);
export const getUserByIdList = createAsyncThunk(
  "events/getUserByIdList",
  async (id) => {
    try {
      const response = await getUserById(id);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addUserList = createAsyncThunk("events/addUser", async (user) => {
  try {
    const response = await addUser(user);
    toast.success("User Added Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("User Added Failed", { autoClose: 3000 });
    return error;
  }
});

export const deleteUserList = createAsyncThunk(
  "events/deleteUser",
  async (id) => {
    try {
      await deleteUser(id);
      toast.success("User Delete Successfully", { autoClose: 3000 });
      return id;
    } catch (error) {
      toast.error("User Delete Failed", { autoClose: 3000 });
      return error;
    }
  }
);
export const getUserMediaCountList = createAsyncThunk(
  "events/getUserMediaCountList",
  async (userId) => {
    try {
      const response = await getUserMediaCount(userId);
      return response;
    } catch (error) {
      return error;
    }
  }
);
export const getUserMediaListById = createAsyncThunk(
  "events/getUserMediaListById",
  async (userId) => {
    try {
      const response = await getUserMediaList(userId);
      return response;
    } catch (error) {
      return error;
    }
  }
);
export const updateUserList = createAsyncThunk(
  "events/updateUserList",
  async ({ id, user }) => {
    try {
      const response = await updateUser(id, user);
      toast.success("User Updated Successfully", { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error("User Update Failed", { autoClose: 3000 });
      return error;
    }
  }
);
