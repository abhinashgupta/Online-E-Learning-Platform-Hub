import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "../../services/courseService";

const initialState = {
  courses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new course
export const createCourse = createAsyncThunk(
  "courses/create",
  async (courseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token; // Placeholder for token
      return await courseService.createCourse(courseData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all courses
export const getCourses = createAsyncThunk(
  "courses/getAll",
  async (_, thunkAPI) => {
    try {
      return await courseService.getCourses();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = action.payload;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
