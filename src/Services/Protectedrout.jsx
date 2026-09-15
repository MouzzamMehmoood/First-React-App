import { Navigate } from "react-router-dom";

const Protectedrout = ({ children }) => {
  const auth = localStorage.getItem("loggedin");

  return auth ? children : <Navigate to="/Login" replace />;
};

export default Protectedrout;
