import { Navigate, Outlet } from "react-router-dom";
import TeacherAndStudentLayout from "../common/TeacherAndStudent/TeacherAndStudentLayout";
const isLogin = () => {
  if (localStorage.getItem("encrypted_data_ts")) {
    return true;
  }
  return false;
};

const PrivateRoute = () => {
  return isLogin() ? (
    <>
      <TeacherAndStudentLayout />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
