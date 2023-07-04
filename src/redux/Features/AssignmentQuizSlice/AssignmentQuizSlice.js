import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";
const BASE_V1_ROOT = api;

export const getAssignmentQuiz = createAsyncThunk(
  "Quiz/GetQuiz",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_V1_ROOT}get-quiz`, payload);
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

const assignmentQuizSlice = createSlice({
  name: "quizAssignment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAssignmentQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssignmentQuiz.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          details: action.payload,
        };
      })
      .addCase(getAssignmentQuiz.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          details: {},
          error: action.payload,
        };
      });
  },
});

const quizAssignmentReducer = assignmentQuizSlice.reducer;
export default quizAssignmentReducer;