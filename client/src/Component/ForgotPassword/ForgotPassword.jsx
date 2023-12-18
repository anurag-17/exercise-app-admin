import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import RightSection from "../RightSection";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [isLoading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/forgotpassword', {email:email}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast.success("Mail sent, Please check your mail!")
                setLoading(false)
            } else {
                toast.error("Invalid email!")
                setLoading(false)
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error("Failed please try again!")
            setLoading(false)
        }
    };


    return (
        <div className="flex items-center justify-center lg:min-h-screen  ">
            <div className="md:px-[50px] w-full mx-auto">
                <div
                    className="relative flex flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 min-h-screen justify-center lg:shadow-none  items-center lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px] "
                >

                    <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
                        <form action="" className="" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 justify-center p-8 lg:p-14 md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto ">
                                <div className="text-left ">
                                    <p className="mb-2 2xl:text-[40px] md:text-[35px] text-[30px] leading-[38px] font-bold">Forgot your password</p>
                                    <p className=" md:text-[16px] text-[15px] font-[400] leading-[26px] text-gray-400 mt-2 mb-4 text-[#494949]">
                                        Please enter the email you used to sign-in.
                                    </p>
                                </div>
                                <div className="md:py-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        className="login-input w-full mt-2 custom-input"
                                        onChange={(e) => setEmail(e.target.value)}
                                        pattern="[-a-zA-Z0-9~!$%^ *_=+}{'?]+(\.[-a-zA-Z0-9~!$%^ *_=+}{'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.([cC][oO][mM]))(:[0-9]{1,5})?"
                                        title="enter valid email ex. abc@gmail.com"
                                        required />
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#1f2432] font-medium text-white p-2 rounded-lg  hover:bg-white hover:border hover:border-gray-300 h-[50px] login-btn"
                                    >
                                        {isLoading ? "Loading.." : "Get  link"}
                                    </button>
                                    <Link to="/login">
                                        <div className="text-[16px] font-medium underline text-center py-3 cursor-password">Login</div>
                                    </Link>
                                </div>

                            </div>
                        </form>
                    </div>
                    <RightSection />
                </div>
            </div>
        </div>
    )
};

export default ForgotPassword;
