import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Pages/Home";
import Protectedrout from "./Services/Protectedrout";
import Product from "./Pages/Product";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protectedrout>
                <Home />
              </Protectedrout>
            }
          />
          <Route
            path="/product"
            element={
              <Protectedrout>
                <Product />
              </Protectedrout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
