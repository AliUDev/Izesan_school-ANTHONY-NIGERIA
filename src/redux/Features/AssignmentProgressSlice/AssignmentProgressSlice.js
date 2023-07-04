import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const BASE_V1_ROOT = api;

export const getAssignmentProgress = createAsyncThunk(
  "studentQuizAssignment/attemptAssignment",
  async (payload, { rejectWithValue }) => {
    const { student_id, class_language, module_no, module_id } = payload;
    try {
      const res = await axios.get(
        `${BASE_V1_ROOT}get-school-chapter-progress?module_no=${module_no}&assigned_module_id=${module_id}&language=${class_language}&student_id=${student_id}`
      );
      return res.data;
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
  details: {},
};

const assignmentProgressSlice = createSlice({
  name: "attemptAssignment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAssignmentProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssignmentProgress.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          details: action.payload,
        };
      })
      .addCase(getAssignmentProgress.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          details: {},
          error: action.payload,
        };
      });
  },
});

const assignmentProgressReducer = assignmentProgressSlice.reducer;
export default assignmentProgressReducer;
