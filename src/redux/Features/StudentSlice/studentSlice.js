import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
  allStudents: [],
  isLoading: true,
};

const allStudentSlice = createSlice({
    name: 'StudentSlice',
    initialState,
    reducers:{
        getStudent : (state, action) =>{
            state.allStudents = action.payload;
            state.isLoading  = false;
        },
        setLoading: (state) => {
          state.isLoading = true;
        },
    }
})

export const {getStudent} = allStudentSlice.actions;
const { setLoading } = allStudentSlice.actions;


export const fetchStudentData = (param) => async (dispatch) => {
  dispatch(setLoading());

    try {
        const response = await axios.post(`${api}get-student`, {
            class_code: param,
        });
        const newData = await response.data.data;
        dispatch(getStudent(newData));
      } catch (error) {
        console.log(error);
      }
}

export default allStudentSlice.reducer;
