import logo from './logo.svg';
import './App.css';
import { Upload } from './Component/Upload';
import Login from "./Component/Login";
import SideMenu from "./Component/Main";
import Page1 from "./Component/Page1";
import Page2 from "./Component/Page2";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from './Component/Dashboard';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    // <div className="App">
    // <Upload/>
    // </div>
    <div>
      
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<SideMenu />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/admindashboard" element={<SideMenu />} />

          <Route path="/one" element={<Page1 />} />
          <Route path="/two" element={<Page2 />} />
          {/* <Route path="/summary" element={<Summary />} /> */}
          {/* <Route path="/summaryData/:id" element={<SummaryData />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
          
      />
    
    </div>
  );
}

export default App;
