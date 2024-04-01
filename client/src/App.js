import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import SideMenu from "./Component/Main";
import Login from "./Component/Login";
import './App.css';

import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./Component/ForgotPassword/ResetPassword";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ChangePassword from "./Component/ChangePassword/Index";
import PrivacyPolicy from "./Component/privacypolicy";



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
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/privacy&policy" element={<PrivacyPolicy />} />


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
