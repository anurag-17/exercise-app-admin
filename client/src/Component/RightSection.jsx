import React from "react";
import bgImg from "../assets/gym.jpg"


const RightSection = () => {
    return (
        <div className="block lg:w-[50%] px-[10px] lg:px-0">
            <img
                src={bgImg}
                alt="img"
                className="w-full h-auto mx-auto"
            />
        </div>)
};

export default RightSection;
