import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import SideMenu from "./Component/Main";
import Login from "./Component/Login";
import './App.css';

import "react-toastify/dist/ReactToastify.css";

import ForgotPassword from './Component/ForgotPassword';
import ResetPassword from './Component/ResetPassword';


function App() {

  function PrivateRoute({ path, element }) {

    const isAuthenticated = JSON.parse(sessionStorage.getItem("sessionToken")) !== null;
  
    return isAuthenticated ? (
      element
    ) : (
      <Navigate to="/login" />
    );
  }
 
  return (

    <div>
      
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admindashboard"
            element={<PrivateRoute element={<SideMenu />} />}
          />
          <Route
            path="/"
            element={<PrivateRoute element={<SideMenu />} />}
          />

        </Routes>
      </BrowserRouter>
      <ToastContainer

      />
    
    </div>
  );
}

export default App;
