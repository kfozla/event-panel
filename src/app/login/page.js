import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";

function page() {
  return (
    <div>
      <Login />
      <Register />
      <ForgetPassword />
    </div>
  );
}

export default page;
