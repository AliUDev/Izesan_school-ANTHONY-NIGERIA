import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
  allgrades: [],
  isLoading: true,
  error: null,
};

const allgradeSlice = createSlice({
  name: "gradeSlice",
  initialState,
  reducers: {
    getgrade: (state, action) => {
      state.allgrades = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null; // reset the error when starting to load again
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { getgrade, setLoading, setError } = allgradeSlice.actions;

export const fetchgradeData = (param) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const response = await axios.get(`${api}get-grade-book?class_code=${param}`);
    dispatch(getgrade(response.data));
  } catch (error) {
    console.log(error);
    dispatch(setError(error.message));
  }
};

export default allgradeSlice.reducer;
