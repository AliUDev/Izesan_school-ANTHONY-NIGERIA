import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
  classWorkModuleAssignment: [],
  isLoading: true,
};

const classWorkModuleAssignmentSlice = createSlice({
  name: "classWorkModuleAssignment",
  initialState,
  reducers: {
    getClasWorkModuleAssignment: (state, action) => {
      state.classWorkModuleAssignment = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { getClasWorkModuleAssignment } = classWorkModuleAssignmentSlice.actions;
const { setLoading } = classWorkModuleAssignmentSlice.actions;

export const fetchDataOfClassworkModuleAssignment = (code) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(`${api}show-classwork-module-assignment`, {
      class_code: code,
    });
    dispatch(getClasWorkModuleAssignment(response.data));
  } catch (error) {
    console.log(error);
  }
};


export default classWorkModuleAssignmentSlice.reducer;
