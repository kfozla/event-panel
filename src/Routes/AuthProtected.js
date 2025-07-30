import React from "react";
import { Navigate } from "react-router-dom";

const AuthProtected = ({ children }) => {
  const authUser = JSON.parse(sessionStorage.getItem("authUser") || "null");
  const token = authUser && authUser.token;

  if (!authUser || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthProtected;
