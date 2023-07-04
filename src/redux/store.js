import { configureStore } from "@reduxjs/toolkit";
import languagesSliceReducer from "./Features/LanguagesSlice/languagesSlice";
import classesListSliceReducer from "./Features/ClassesListSlice/classesListSlice";
import classWorkReducer from "./Features/ClassWorkSlice/ClassWorkSlice";
import assignmentReducer from "./Features/AssignmentSlice/AssignmentSlice";
import studentReducer from "./Features/StudentSlice/studentSlice";
import gradeBookReducer from "./Features/GradesSlice/gradeSlice";
import classesListReducer from "./TeacherAndStudent/ClassesListSlice";
import loaderSlice from "./Features/Loader/loaderSlice";
import assignmentProgressReducer from "./Features/AssignmentProgressSlice/AssignmentProgressSlice";
import updateAssignmentReducer from "./Features/UpdateAssignmentProgressSlice/UpdateAssignmentProgressSlice";
import classworkModuleAssignmentReducer from "./Features/ClassWorkModuleSlice/ClassWorkModuleSlice";
import quizAssignmentReducer from "./Features/AssignmentQuizSlice/AssignmentQuizSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    loading: loaderSlice,
    languagesDetails: languagesSliceReducer,
    classesListDetails: classesListSliceReducer,
    classWorkDetails: classWorkReducer,
    classworkModuleAssignmentDetails: classworkModuleAssignmentReducer,
    assignmentDetails: assignmentReducer,
    studentDetails: studentReducer,
    gradeBookDetails: gradeBookReducer,
    newClassesListDetails: classesListReducer,
    assignmentProgressDetails: assignmentProgressReducer,
    updateAssignmentDetail: updateAssignmentReducer,
    quizAssignmentReducerDetails: quizAssignmentReducer
  },
});

setupListeners(store.dispatch);
