import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
  allclassWork: [],
  isLoading: true,
};

const classWorkSlice = createSlice({
  name: "classWorkList",
  initialState,
  reducers: {
    getclassWork: (state, action) => {
      state.allclassWork = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { getclassWork } = classWorkSlice.actions;
const { setLoading } = classWorkSlice.actions;


export const fetchDataofClassWork = (code) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const response = await axios.post(`${api}get-classwork`, {
      class_code: code,
    });
    dispatch(getclassWork(response.data));
  } catch (error) {
    console.log(error);
  }
};

export default classWorkSlice.reducer;
