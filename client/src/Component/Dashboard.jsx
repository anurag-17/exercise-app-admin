import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import dashboardImage from "../assets/dashboardImage"
import dash_img from "../assets/dashboard.webp";
import PasswordIcon from "./Svg/PasswordIcon";
import ProfileIcon from "./Svg/ProfileIcon";
import SignOutIcon from "./Svg/SignOutIcon";


const Dashboard = () => {
  return (
    <>
      <section>
        <div className="flex flex-col h-[100vh] justify-center gap-20 items-center bg-white relative" >
          <div className="absolute right-[35px] top-[15px] cursor-pointer ">
            {/* <ProfileIcon /> */}

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center items-center">

                  <ProfileIcon className="ml-2 h-4 w-4 text-gray-700" />
                  {/* <span className="hidden md:block font-medium text-gray-700">
                    Admin
                  </span> */}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform scale-95"
                enterTo="transform scale-100"
                leave="transition ease-in duration=75"
                leaveFrom="transform scale-100"
                leaveTo="transform scale-95"
              >
                <Menu.Items className="absolute right-0 w-56 z-50 mt-2 px-2 py-5 shadow-2xl rounded-lg origin-top-right border border-[#f3f3f3]  side-profile">
                  <div className="p-1 flex flex-col gap-4">

                    <Menu.Item>
                      <Link
                        to="/change-password"
                        className="flex gap-x-3 hover:bg-lightBlue-600 hover:underline text-gray-700 rounded  text-sm group transition-colors items-center"
                      >
                        <PasswordIcon className="h-4 w-4 mr-2" />
                        Change password
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/login"
                        className="flex gap-x-3 hover:bg-lightBlue-600 hover:underline text-gray-700 rounded  text-sm group transition-colors items-center"

                      >
                        <SignOutIcon  />
                        Sign out
                      </Link>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

          </div>
          <div className="text-center">
            <h3 className="text-[28px] font-bold">Welcome</h3>
            <h5 className="pt-2 text-[25px] font-semibold ">Admin Dashboard</h5>
          </div>
          <div className="w-[30%]">
            <img src={dash_img} alt="welcome dashboard" className="w-full" />
            <div>
             
            </div>
          </div>
        </div>
      </section>


    </>
  )
};

export default Dashboard;