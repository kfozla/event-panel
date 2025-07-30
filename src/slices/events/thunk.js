import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventUserList as getEventUserListApi,
} from "../../api/events";

export const getEventList = createAsyncThunk(
  "events/getEventList",
  async () => {
    try {
      const response = await getEvents();
      return response;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);
export const getEventByIdList = createAsyncThunk(
  "events/getEventByIdList",
  async (id) => {
    try {
      const response = await getEventById(id);
      return response;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

export const addEventList = createAsyncThunk(
  "events/addEvent",
  async (event) => {
    try {
      const response = await createEvent(event);
      toast.success("event Added Successfully", { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error("event Added Failed", { autoClose: 3000 });
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

export const updateEventList = createAsyncThunk(
  "events/updateEvent",
  async (event) => {
    try {
      const response = await updateEvent(event);
      toast.success("event Updated Successfully", { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error("event Updated Failed", { autoClose: 3000 });
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);

export const deleteEventList = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    try {
      await deleteEvent(id);
      toast.success("event Delete Successfully", { autoClose: 3000 });
      return id;
    } catch (error) {
      toast.error("event Delete Failed", { autoClose: 3000 });
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);
export const getEventUserList = createAsyncThunk(
  "events/getEventUserList",
  async (eventId) => {
    try {
      const response = await getEventUserListApi(eventId);
      return response;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || error.message);
    }
  }
);
