import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Login from "../Components/Login";
import Home from "../Pages/Home";

const Protectedrout = () => {
  const auth = localStorage.getItem("loggedin");
  return auth ? <Home /> : <Navigate to={"/Login"} />;
};

export default Protectedrout;
