import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../api";
import { typeProvider } from "../../Helper/ParticipantTypeProvider";

const BASE_V1_ROOT = api;
const END_POINT = "all-classes";

const ALL_CLASSES_URL = `${BASE_V1_ROOT}${END_POINT}`;

export const getAllClasses = createAsyncThunk(
  "studentOrTeacher/classes",
  async (parameter, { rejectWithValue }) => {
    var payload = {};
    const caseType = typeProvider();
    if (caseType === "teacher") {
      payload = { teacher_id: parameter };
    } else {
      payload = { participants: parameter };
    }
    try {
      const res = await axios.post(`${ALL_CLASSES_URL}`, payload);
      return res.data.data[0];
    } catch (err) {
      if (!err.response) {
        
        return rejectWithValue({ message: err.message, status: 500 });
      }
      const { status, data } = err.response;
      return rejectWithValue({ message: data.message, status });
    }
  }
);

const initialState = {
  loading: false,
  error: {},
  classes: {},
};

const classesSlice = createSlice({
  name: "classesList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          classes: action.payload,
        };
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          classes: {},
          error: action.payload,
        };
      });
  },
});


const classesListReducer = classesSlice.reducer;
export default classesListReducer;
