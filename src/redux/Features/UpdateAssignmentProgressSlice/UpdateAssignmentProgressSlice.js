import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";
const BASE_V1_ROOT = api;
const END_POINT = "save-school-chapter-progress";
const UPDATE_PROGRESS_URL = `${BASE_V1_ROOT}${END_POINT}`;

export const updateModuleAssignmentProgress = createAsyncThunk(
  "updateModuleAssignment/progress",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${UPDATE_PROGRESS_URL}`, payload);
      return res.data.data;
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
  data: [],
};

const updateAssignmentProgressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(updateModuleAssignmentProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateModuleAssignmentProgress.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      })
      .addCase(updateModuleAssignmentProgress.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      });
  },
});

const updateAssignmentReducer = updateAssignmentProgressSlice.reducer;
export default updateAssignmentReducer;
