import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './screens/Login';

import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/css/kaiadmin.min.css'
import MainScreen from './screens/MainScreen';
import Sale from './screens/Sale';
import AddProducts from './screens/AddProducts';
import Suppliers from './screens/Suppliers';
import Products from './screens/Products';
import ProductStock from './screens/ProductStock';


function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
            path="/dashboard"
            element={isAuthenticated ? <MainScreen/> : <Navigate to="/login" />}
        />
        <Route
            path="/sale"
            element={isAuthenticated ? <Sale/> : <Navigate to="/login" />}
        />
      
        <Route
            path="/Suppliers"
            element={isAuthenticated ? <Suppliers/> : <Navigate to="/login" />}
        />
        <Route
            path="/Products"
            element={isAuthenticated ? <Products/> : <Navigate to="/login" />}
        />
        <Route
            path="/ProductStock"
            element={isAuthenticated ? <ProductStock/> : <Navigate to="/login" />}
        />
        <Route
            path="/AddToStock"
            element={isAuthenticated ? <AddProducts/> : <Navigate to="/login" />}
        />
    </Routes>
</Router>
  );
}



export default App;
