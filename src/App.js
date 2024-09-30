import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductCreate from "./components/ProductCreate";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <BrowserRouter>
          <ToastContainer />
          <Routes>
          <Route path="/create" element={<ProductCreate/>}/>
          <Route path="/products" element={<ProductList/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;