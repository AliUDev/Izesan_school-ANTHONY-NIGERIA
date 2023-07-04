import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
  allassignment: [],
  moduleassignment: [],
  isLoading: true,
};

const assignmentSlice = createSlice({
  name: "assignmentList",
  initialState,
  reducers: {
    getassignment: (state, action) => {
      state.allassignment = action.payload;
      state.isLoading = false;
    },
    getmoduleassignment: (state, action) => {
      state.moduleassignment = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { getassignment } = assignmentSlice.actions;
export const { getmoduleassignment} = assignmentSlice.actions;
const { setLoading } = assignmentSlice.actions;

export const fetchDataofassignment = (code) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`${api}get-assignment`, {
      class_code: code,
    });
    dispatch(getassignment(response.data));
  } catch (error) {
    console.log(error);
  }
};
export const fetchDataofmoduleassignment = (code) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const response = await axios.post(`${api}show-module-assignment`, {
      class_code: code,
    });
    dispatch(getmoduleassignment(response.data));
  } catch (error) {
    console.log(error);
  }
};

export default assignmentSlice.reducer;
