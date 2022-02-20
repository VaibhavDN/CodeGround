import { createSlice, configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import set from "lodash/set";

const prepareFinalObject = (preparedFinalOject, jsonPath, value) => {
  set(preparedFinalOject, jsonPath, value);
  return preparedFinalOject;
};

const slice = createSlice({
  name: "setAppData",
  initialState: {
    preparedFinalObject: {},
  },
  reducers: {
    setAppData: (state, action) => {
      const updatedPreparedFinalObject = prepareFinalObject(
        { ...state.preparedFinalObject },
        action.payload.path,
        action.payload.value
      );
      return { ...state, preparedFinalObject: updatedPreparedFinalObject };
    },
  },
});

const reducer = combineReducers({
  reducer: slice.reducer,
});

const store = configureStore({
  reducer,
});

export const { setAppData } = slice.actions;
export default store;
