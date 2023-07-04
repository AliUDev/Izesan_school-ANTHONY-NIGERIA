import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

// initial state
const initialState = {
  allClasses: [],
  isLoading: true,
};

// slice
const classesSlice = createSlice({
  name: "classesList",
  initialState,
  reducers: {
    getClasses: (state, action) => {
      state.allClasses = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

// initialization of action types
const { getClasses } = classesSlice.actions;
const { setLoading } = classesSlice.actions;

// API call
export const fetchDataofClasess = (caseType, email) => async (dispatch) => {
  dispatch(setLoading());
  var payload = {};
  if (caseType === "teacher") {
    payload = { teacher_id: email };
  } else {
    payload = { participants: email };
  }
  try {
    const response = await axios.post(`${api}all-classes`, payload);
    const newRes = await response.data.data[0];
    dispatch(getClasses(newRes));
  } catch (error) {
    console.log(error);
  }
};

export default classesSlice.reducer;
