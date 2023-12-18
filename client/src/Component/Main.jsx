import React, { Fragment, useState } from "react";
import {useNavigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import User from "./User/Index";
import Category from "./Category/Category";
import DashboardIcon from "./Svg/DashboardIcon";
import UserIcon from "./Svg/UserIcon";
import CategoryIcon from "./Svg/CategoryIcon";
import LogoutIcon from "./Svg/Logout";

export const menus = [
    {
        id: 0,
        label: "Dashboard",
        component: <Dashboard />,
        icon: <DashboardIcon />
    },
    {
        id: 1,
        label: "User",
        component: <User />,
        icon: <UserIcon />,
    },
    {
        id: 2,
        label: "Category",
        component: <Category />,
        icon: <CategoryIcon />,
    },
]

const SideMenu = () => {
    const [ComponentId, setComponentId] = useState(0);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem("sessionToken")))
    const [showDrawer, setShowDrawer] = useState(false)
    // console.log(token);
    const navigate = useNavigate()
    useEffect(() => {
        if (token) {
            verify()
        }
        else {
            navigate("/")
        }
    }, [])

    const verify = async () => {
        try {
            const res = await axios.get(`/api/auth/verifyToken/${token}`);
            //   console.log(res);
            if (res.status === 200) {
                return; // Do whatever you need after successful verification
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            toast.error("Something went wrong.")
            navigate("/");
            // Handle the error, maybe navigate somewhere or show an error message
        }
    };
    const handleClick = (id) => {
        setComponentId(id)
        setShowDrawer(false)
    }
    const handleSignout = () => {
        sessionStorage.removeItem("sessionToken")
        navigate("/")
    }


    return (
        <section className="">
            <div className="flex min-h-screen relative lg:static">
                <div className="py-2 px-3  absolute top-4 left-2 flex flex-col gap-[5px] cursor-pointer lg:hidden"
                    onClick={() => setShowDrawer(true)}>
                    <div className="bg-black h-[2px] w-[20px]"></div>
                    <div className="bg-black h-[2px] w-[20px]"></div>
                    <div className="bg-black h-[2px] w-[20px]"></div>
                </div>


                <div className={`w-[300px] bg-[#1f2432] text-white lg:py-[40px] lg:px-[40px] px-[10px] py-[10px] drawer
                 ${showDrawer ? "block  absolute top-0 left-0 min-h-screen is-show" : "hidden lg:block"}`} >
                    <div className="relative text-white  flex flex-col gap-[5px] cursor-pointer lg:hidden  text-right mr-3 mt-2"
                        onClick={() => setShowDrawer(false)}>
                        <div className="">X</div>
                    </div>
                    <div className="">
                        <div className="flex justify-center items-center whitespace-pre-wrap py-[30px] mt-6">
                            <h1 className="2xl:text-[30px] lg:text-[26px] text-[24px] font-semibold  text-center whitespace-nowrap">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="bg-white h-[1px] w-[70%] mx-auto"></div>
                        <div className="flex flex-col 2xl:gap-8 gap-5 pt-[80px]">
                            {menus.map((item, index) => (
                                <div key={index}
                                    className={`pl-6 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu
                                    ${item.id === ComponentId ? "bg-[#343a47]" : "hover:bg-[#343a47] hover:text-white hover:rounded-md"}  `}
                                    onClick={() => handleClick(item.id)} >

                                    {item?.icon}
                                    <p className=" capitalize whitespace-nowrap ">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white h-[1px] w-[70%] mx-auto mt-[140px]"></div>
                    </div>

                    <div
                        className={` pl-6 py-3 mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  font-semibold hover:bg-[#343a47] hover:text-white hover:rounded-md }`}
                        onClick={handleSignout}
                    >
                        <LogoutIcon />
                        <div>
                            <p>Sign Out</p>
                        </div>
                    </div>

                </div>
                <div className=" bg-[#f3f3f3] w-full  " >

                    {menus.map((item, index) => (
                        <Fragment key={index}>
                            {
                                ComponentId === item.id &&
                                item.component
                            }
                        </Fragment>
                    ))}

                </div>
            </div>
        </section>

    )
};

export default SideMenu;
