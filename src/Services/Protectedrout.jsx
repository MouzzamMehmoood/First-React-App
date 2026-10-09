import { Navigate } from "react-router-dom";

const Protectedrout = ({ children, requireAdmin = false }) => {
  const auth = localStorage.getItem("loggedin");
  const isAdmin = localStorage.getItem("isAdmin");

  if (!auth || (requireAdmin && !isAdmin)) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default Protectedrout;
