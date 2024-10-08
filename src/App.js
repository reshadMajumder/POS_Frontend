import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './screens/Login';

import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/css/kaiadmin.min.css'
import MainScreen from './screens/MainScreen';
import Sale from './screens/Sale';
import Suppliers from './screens/Suppliers';
import Products from './screens/Products';
import ProductStock from './screens/ProductStock';
import AddproductsT from './screens/AddproductsT';
import BankDetails from './screens/BankDetails';
import Assets from './screens/Assets';
import CashTransaction from './screens/CashTransaction';
import Liabilities from './screens/Liabilities';
import SaleReturn from './screens/SaleReturn';


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
            element={isAuthenticated ? <AddproductsT/> : <Navigate to="/login" />}
        />
        <Route
            path="/bank"
            element={isAuthenticated ? <BankDetails/> : <Navigate to="/login" />}
        />
        <Route
            path="/assets"
            element={isAuthenticated ? <Assets/> : <Navigate to="/login" />}
        />
        <Route
            path="/cash"
            element={isAuthenticated ? <CashTransaction/> : <Navigate to="/login" />}
        />
        <Route
            path="/liabilities"
            element={isAuthenticated ? <Liabilities/> : <Navigate to="/login" />}
        />
        <Route
            path="/sale-return"
            element={isAuthenticated ? <SaleReturn/> : <Navigate to="/login" />}
        />
    </Routes>
</Router>
  );
}



export default App;
