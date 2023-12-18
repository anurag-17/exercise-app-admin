import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import bgImg from "../assets/bg-img.svg"
import logo from "../assets/logo.svg"

const Login = () => {

    // const base_url = process.env.BASE_URL

    // console.log(base_url)
    const navigate = useNavigate()
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const InputHandler = (e) => {
        setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value })
    }
    useEffect(() => {
      sessionStorage.removeItem("sessionToken")
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/admindashboard")
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/adminlogin', loginDetails, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // console.log('Login successful');
                toast.success("Login successful!")
                setLoading(false)
                sessionStorage.setItem("sessionToken",JSON.stringify(response.data.token) )
                // console.log(response.data.token);
                navigate("/admindashboard")
            } else {
                setError('Invalid credentials');
                toast.error("Invalid credentials!")
                sessionStorage.removeItem("sessionToken")
                setLoading(false)
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError("Login failed please try again!")
            toast.error("Login failed please try again!")
            sessionStorage.removeItem("sessionToken")

            setLoading(false)
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3] ">
                <div
                    className="relative flex flex-col gap-x-20 items-center lg:flex-row m-6 space-y-8 md:space-y-0 w-[100%] md:w-[80%]"
                >
                    <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
                        <form action="" className="" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 justify-center p-8 md:p-14 md:max-w-[80%] lg:max-w-[100%] mx-auto  bg-white shadow-2xl rounded-2xl ">
                                <div className="text-center">
                                    <p className="mb-2 2xl:text-[40px]  md:text-[30px] text-[24px] font-bold">Welcome Admin</p>
                                    <p className="2xl:text-[18px] md:text-[16px] text-[15px  first-letter:] font-light text-gray-400 mb-4">
                                        Welcome back! Please enter your details
                                    </p>
                                </div>
                                <div className="md:py-2">
                                    <span className="login-input-label">Email</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="login-input w-full mt-2 "
                                        onChange={InputHandler}
                                        pattern="[-a-zA-Z0-9~!$%^ *_=+}{'?]+(\.[-a-zA-Z0-9~!$%^ *_=+}{'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.([cC][oO][mM]))(:[0-9]{1,5})?"
                                        title="enter valid email ex. abc@gmail.com"
                                        required />
                                </div>
                                <div className="">
                                    <span className="login-input-label">Password</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter password"
                                        className="login-input w-full mt-2 "
                                        onChange={InputHandler}
                                        minLength={4}
                                        required />
                                    <div className="flex items-center mt-3 px-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="showPassword" className="login-input-label">Show Password</label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-theme-color font-medium text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                                    >
                                        Sign in
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="p-10 hidden lg:block lg:w-[40%] xl:w-[50%]     ">
                        <img
                            src={bgImg}
                            alt="img"
                            className="w-[280px] h-auto mx-auto"  
                        // class="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                        />

                    </div>
                </div>
            </div>
            {/* <ToastContainer/>    */}
            {/* <section className="h-auto md:h-[100vh] flex flex-col items-center justify-center md:py-10 px-10 py-[100px]">
            <div className="md:w-full lg:w-[80%] 2xl:w-[60%] bg-[white] shadow rounded-[3px]">
                <div className="grid md:grid-cols-2">
                    <div className="px-10 md:py-14  py-16 flex flex-col items-center justify-center lg:gap-12 md:gap-10 gap-12 bg-theme-color ">
                        <div className="">
                            <img src={logo} alt="fittness" />
                        </div>
                        <h1 className=" text-[26px] font-medium text-white text-center"> Login into Admin Dashboard</h1>
                        <form action="" onSubmit={handleSubmit}>
                            <div className=" flex flex-col items-center justify-center xl:gap-10 lg:gap-7 gap-5  lg:w-[350px] mx-auto">
                                <div className="w-full  ">
                                    <label htmlFor="email" className="login-input-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="login-input w-full"
                                        onChange={InputHandler}
                                        pattern="[-a-zA-Z0-9~!$%^ *_=+}{'?]+(\.[-a-zA-Z0-9~!$%^ *_=+}{'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.([cC][oO][mM]))(:[0-9]{1,5})?"
                                        title="enter valid email ex. abc@gmail.com"
                                        required />
                                </div>
                                <div className="">
                                    <label htmlFor="password" className="login-input-label">password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter password"
                                        className="login-input w-full"
                                        onChange={InputHandler}
                                        minLength={8}
                                        required />
                                    <div className="flex items-center mt-3 px-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="mr-2"
                                            />
                                        <label htmlFor="showPassword" className="login-input-label">Show Password</label>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <button type="submit" className={`login-button ${isLoading ? "cursor-disable" : "cursor-pointer"}`}>
                                        {isLoading ? "Loading..." : "Login"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="px-10 py-10 md:flex flex-col items-center justify-center hidden text-center">
                        <img src={bgImg} alt="bg-img" />
                    </div>
                </div>
            </div>
        </section> */}


        </>
    )
};

export default Login;
