import React from "react";
import dash_img from "../assets/dashboard.svg"
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  return (
    <>
    <section>
      <div className="flex flex-col h-[100vh] justify-center gap-20 items-center bg-white">
      <div className="text-center">
      <h3 className="text-[28px] font-bold">Welcome</h3>
        <h5 className="pt-2 text-[25px] font-semibold ">Admin Dashboard</h5>
      </div>
        <div className="w-[30%]">
          <img src={dash_img} alt="welcome dashboard"  className="w-full"/>
        </div>
      </div>
    </section>
   
    </>
  )
};

export default Dashboard;