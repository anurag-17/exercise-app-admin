import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import VideoPopup from "./VideoPopup";
import CloseIcon from "../Svg/CloseIcon";

const AllVideosPopup = ({ data }) => {
  let [isShowVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  console.log(data);
  const closeVideoPopup = () => {
    setShowVideo(false);
  };

  const handleVideoShow = (vid) => {
    setVideoUrl(vid);
    setShowVideo(true);
  };

  return (
    <>
      <div
        className={`grid justify-center items-center gap-5 text-center 
      ${data.length == 2 ? "md:grid-cols-2" : (data.length == 1) ? "grid-cols-1" : "lg:grid-cols-3 md:grid-cols-2"}  
        
      `}
      >
        {data?.map((items, index) => (
          <div className="border border-[#407cb892] rounded-[6px] p-4 w-auto">
            <video
              controls
              className="w-full h-[150px] border border-[#f3f3f3] rounded"
            >
              <source src={items} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="py-2 flex flex-col justify-center items-center">
              <button
                className="custom-button whitespace-nowrap md:w-auto w-full h-[30px] "
                onClick={() => handleVideoShow(items)}
              >
                View video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*---------- Video popup---------- */}

      <Transition appear show={isShowVideo} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeVideoPopup}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-auto max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[15px] top-[15px] cursor-pointer"
                    onClick={closeVideoPopup}
                  >
                    <CloseIcon />
                  </div>

                  <VideoPopup closeModal={closeVideoPopup} data={videoUrl} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AllVideosPopup;
