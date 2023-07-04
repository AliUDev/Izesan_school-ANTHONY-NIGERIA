import { Navigate, Outlet } from "react-router-dom";
import SchoolLayout from "../common/School/SchoolLayout";
const isLogin = () => {
  if (localStorage.getItem("encrypted_data")) {
    return true;
  }
  return false;
};

const PrivateRouteSchool = () => {
  return isLogin() ? (
    <>
      <SchoolLayout/>
      <Outlet />
    </>
  ) : (
    <Navigate to="/school-login" />
  );
};

export default PrivateRouteSchool;
