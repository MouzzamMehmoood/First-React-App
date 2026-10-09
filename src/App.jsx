import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Pages/Home";
import Protectedrout from "./Services/Protectedrout";
import Product from "./Pages/Product";
import Shop from "./Pages/Shop";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";

const App = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/Dashboard"
            element={
              <Protectedrout requireAdmin>
                <Home />
              </Protectedrout>
            }
          />
          <Route
            path="/product"
            element={
              <Protectedrout requireAdmin>
                <Product />
              </Protectedrout>
            }
          />
          <Route
            path="/orders"
            element={
              <Protectedrout requireAdmin>
                <Orders />
              </Protectedrout>
            }
          />
          <Route
            path="/customers"
            element={
              <Protectedrout requireAdmin>
                <Customers />
              </Protectedrout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
