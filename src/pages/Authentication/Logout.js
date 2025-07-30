import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { logoutUser } from "../../api/authentication";
import axios from "axios";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);
  // authUser objesinden refreshToken'ı al
  const authUser = JSON.parse(sessionStorage.getItem("authUser") || "null");
  const refreshToken = authUser && authUser.refreshToken;

  useEffect(() => {
    const doLogout = async () => {
      try {
        // refreshToken'ı API'ya gönder
        await logoutUser(refreshToken);
        console.log("Logout successful");
        sessionStorage.clear();
      } catch (e) {}
      delete axios.defaults.headers.common["Authorization"];
      setLoggedOut(true);
    };
    doLogout();
  }, []);

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }
  return null;
};

export default Logout;
