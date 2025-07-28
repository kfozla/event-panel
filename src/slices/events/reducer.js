import { createSlice } from "@reduxjs/toolkit";
import {
  getEventList,
  getEventByIdList,
  addEventList,
  updateEventList,
  deleteEventList,
  getEventUserList,
} from "./thunk";
export const initialState = {
  eventLists: [],
  error: {},
};

const EventsSlice = createSlice({
  name: "EventsSlice",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getEventList.fulfilled, (state, action) => {
      state.eventLists = action.payload;
    });
    builder.addCase(getEventList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getEventByIdList.fulfilled, (state, action) => {
      const event = action.payload;
      const existingEvent = state.eventLists.find((e) => e.id === event.id);
      if (existingEvent) {
        Object.assign(existingEvent, event);
      } else {
        state.eventLists.push(event);
      }
    });
    builder.addCase(getEventByIdList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(addEventList.fulfilled, (state, action) => {
      state.eventLists.push(action.payload);
    });
    builder.addCase(addEventList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(updateEventList.fulfilled, (state, action) => {
      state.eventLists = state.eventLists.map((event) =>
        event.id.toString() === action.payload.id.toString()
          ? { ...event, ...action.payload }
          : event
      );
    });
    builder.addCase(updateEventList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(deleteEventList.fulfilled, (state, action) => {
      state.eventLists = state.eventLists.filter(
        (event) => event.id !== action.payload
      );
    });
    builder.addCase(deleteEventList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getEventUserList.fulfilled, (state, action) => {
      const { eventId, users } = action.payload;
      const event = state.eventLists.find((e) => e.id === eventId);
      if (event) {
        event.users = users;
      }
    });
    builder.addCase(getEventUserList.rejected, (state, action) => {
      state.error = action.payload || null;
    });
  },
});

export default EventsSlice.reducer;
