import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { connect } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import bg_1 from "./assets/images/layout/image_2.png";
import bg_2 from "./assets/images/layout/image_1.png";
import FixedTimeComponent from "./common/FixedTimeComponent";
import LazyLoader from "./common/LazyLoader/LazyLoader";
import GlobalLoader from "./common/GlobalLoader/GlobalLoader";
import { typeProvider } from "./Helper/ParticipantTypeProvider";
const Splash = lazy(() => import("./Layouts/Splash/Splash"));
const ForgetPassword = lazy(() => import("./Layouts/auth/Login/ForgetPassowrd/ForgetPassword"));
const SchoolLogin = lazy(() => import("./Layouts/auth/Login/SchoolLogin/SchoolLogin"));
const SchoolDashboard = lazy(() => import("./Pages/Dashboard/SchoolDashBoard/SchoolDashboard"));
const TeacherLogin = lazy(() => import("./Layouts/auth/Login/TeacherLogin/TeacherLogin"));
const StudentLogin = lazy(() => import("./Layouts/auth/Login/StudentLogin/StudentLogin"));
const TeacherAndStudentDashboard = lazy(() => import("./Pages/Dashboard/TeacherAndStudentDashBoard/TeacherAndStudentDashboard"));
const Error = lazy(() => import("./Pages/Error/Error"));
const RegisterSchool = lazy(() => import("./Layouts/auth/Register/RegisterSchool"));
const PrivateRouteSchool = lazy(() => import("./routes/SchoolRoute"));
const TeacherStudentRoute = lazy(() => import("./routes/TeacherStudentRoute"));
const Profile = lazy(() => import("./Pages/Dashboard/SchoolDashBoard/Profile/Profile"));
const AddTeacher = lazy(() => import("./Pages/Dashboard/SchoolDashBoard/AddTeacher/AddTeacher"));
const AddStudent = lazy(() => import("./Pages/Dashboard/SchoolDashBoard/AddStudent/AddStudent"));
const ClassDetails = lazy(() => import("./Pages/Dashboard/SchoolDashBoard/ClassDeatils/ClassDetails"));
const ProfileTS = lazy(() => import("./Pages/Dashboard/TeacherAndStudentDashBoard/Profile/ProfileTS"));
const AttemptAssignment = lazy(() => import("./Pages/AttemptAssignment/AttemptAssignment"));

const mapStateToProps = (state) => {
  return {
    states: state // Replace with the actual loading state property you want to access
  };
};
function App(props) {
  return (
    <div>
      <div style={{ zIndex: "1500" }}>
        {
          props.states.loading &&
          <GlobalLoader />
        }
      </div>
      <div style={{ zIndex: "0" }}>
        {typeProvider() === "student" &&
        <FixedTimeComponent/>}
        <ToastContainer />
        <img
          className="position-fixed top-0 end-0 background_imgs_all_page"
          src={bg_1}
          alt="..."
        />
        <img
          className="position-fixed bottom-0 start-0 background_imgs_all_page"
          src={bg_2}
          alt="..."
        />
        <BrowserRouter>
          <Suspense fallback={<LazyLoader />}>
            <Routes>
              <Route path="*" element={<Error />} />
              <Route path="/" index element={<Splash />} />
              <Route path="/school-login" element={<SchoolLogin />} />
              <Route path="/register-school" element={<RegisterSchool />} />
              <Route path="/teacher-login" element={<TeacherLogin />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />

              <Route path="/" element={<PrivateRouteSchool />}>
                <Route path="/school-dashboard" element={<SchoolDashboard />} />
                <Route path="/school-profile" element={<Profile />} />
                <Route path="/add-teacher" element={<AddTeacher />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/class-details/:id" element={<ClassDetails />} />
              </Route>

              <Route path="/" element={<TeacherStudentRoute />}>
                <Route path="/dashboard" element={<TeacherAndStudentDashboard />} />
                <Route path="/profile" element={<ProfileTS />} />
                <Route path="/test/:id" element={<AttemptAssignment />} />
                <Route path="/class-details2/:id" element={<ClassDetails />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(App);