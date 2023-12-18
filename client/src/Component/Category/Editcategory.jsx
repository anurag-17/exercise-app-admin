import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import VideoPopup from "./VideoPopup";
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '../Svg/CloseIcon';
const Editcategory = ({ closeModal, editData, refreshdata }) => {
    // console.log(editData);
    const [edit, setEdit] = useState(editData)
    const [imageDisable, setImageDisable] = useState(true)
    const [videoDisable, setVideoDisable] = useState(false)
    let [openVideo, setOpenVideo] = useState(false)
    const [image, setImage] = useState("")
    const [video, setVideo] = useState("");
    const [videoview, setVideoview] = useState("")
    const [isLoading, setLoading] = useState(false);
    const token = JSON.parse(sessionStorage.getItem("sessionToken"))
    // console.log(edit);

    const hideModal = () => {
        closeModal(false)
    }

    useEffect(() => {
        checkImage()
    }, [])

    const checkImage = () => {
        if (!edit?.file) {
            setImageDisable(false)
        }
    }
    const handleVideo = (vid) => {
        setVideoview(vid)
        setOpenVideo(true)
    }
    const handleRemoveImage = () => {
        setEdit({ ...edit, [`file`]: "" })
        setImageDisable(false)
    }
    const removeVideo = (id) => {
        let newVideo = edit.video.filter((items, index) => {
            return index !== id
        })
        setEdit({ ...edit, [`video`]: newVideo })
    }
    const closeVideoModal = () => {
        setOpenVideo(false)
    }
    const InputHandler = (e) => {
        if (e.target.name === "file") {
            // console.log();
            setImage({ file: e.target.files[0] })
        } else if (e.target.name === "video") {
            setVideo({ file: e.target.files[0] })

        } else {
            setEdit({ ...edit, [e.target.name]: e.target.value })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(edit);
        const { _id, ...newEdit } = edit;
        const updatedDetails = newEdit
        setLoading(true)
        try {
            const response = await axios.put('/api/auth/updateCategory', {
                id: _id, updatedDetails
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // console.log('Login successful');
                toast.success("Category updated Successfully.")
                setLoading(false)
                closeModal()
                refreshdata()
            } else {
                // console.log(response);

                toast.error(response)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error during category:', error);

            toast.error("Something went wrong, try again later.")
            setLoading(false)
        }
    }
    const uploadImage = async (e) => {
        if (image == "" || image == undefined) {

            return toast.warn("Please select file.")
        }

        try {
            const response = await axios.post('api/auth/uploadImage', image, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // console.log('Category added:', response?.data);
                setEdit({ ...edit, ['file']: response?.data?.url })
                setImageDisable(true)
            }
            else {
                setEdit({ ...edit, ['file']: "" })
                setImageDisable(false)

            }
        } catch (error) {
            console.error('Error adding category:', error.response.data);
        }
    }
    const addField = async (e) => {

    }
    const uploadVideo = async (e) => {
        try {
            if (!video) {
                return toast.warn("Please select a file.");
            }

            const response = await axios.post('api/auth/uploadImage', video, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // console.log('Video uploaded:', response?.data);
                const videoUrl = response?.data?.url;

                setEdit({ ...edit, video: [...edit.video, videoUrl] });
                setVideoDisable(true);
            } else {

                setVideoDisable(false);
            }
        } catch (error) {
            console.error('Error uploading video:', error.response?.data || error.message);
            // Handle the error: show a message or perform an action accordingly
        }
    }
    return (
        <>
            <form action="" className="" onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center px-4 py-4 md:px-8  ">

                    <div className="py-3 ">
                        <span className="login-input-label">Category</span>
                        <input
                            type="text"
                            name="category"
                            value={edit?.category}
                            pattern="^(?!\s)[a-zA-Z ]{1,}$"
                            placeholder="Enter category name"
                            className="login-input w-full mt-2 "
                            onChange={InputHandler}
                            maxLength={64}
                            required />
                    </div>
                    <div className="py-2 flex items-end gap-x-10 mt-2">
                        <div className="w-[50%]">
                            <span className="login-input-label cursor-pointer mb-3">Image :</span>
                            {
                                edit?.file ?
                                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                                        <img src={edit.file} alt="loading" style={{ width: '100px', height: '100px' }} />
                                        <button
                                            onClick={handleRemoveImage}
                                            className='text-[14px] font-[400] text-[red] hover:bg-[#efb3b38a]'
                                            style={{
                                                position: 'absolute',
                                                top: '0px',
                                                right: '0px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                    : ""
                            }
                            <div className="flex items-center w-full pt-4 " >

                                <input
                                    type="file"
                                    name="file"
                                    disabled={imageDisable}
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 "
                                    id="file"
                                    onChange={InputHandler}
                                    accept="image/png,image/jpg, image/jpeg , image/*"
                                />


                            </div>

                        </div>
                        <div className="">
                            <button className="focus-visible:outline-none bg-[#070708bd] text-white text-[13px] px-4 py-1 rounded" type="button" onClick={uploadImage} disabled={imageDisable}>Upload</button>
                        </div>
                    </div>
                    <div className="py-2 flex  items-end gap-x-10 mt-2">
                        <div className="w-[50%]">
                            <span className="login-input-label cursor-pointer mb-3">Video :</span>
                            {
                                Array.isArray(edit?.video) && edit?.video?.length > 0 ?
                                    edit.video.map((items, index) => {
                                        return (
                                            <>
                                                <div className='p-1 flex' key={index}>
                                                    <div className="text-[14px] font-[400]  cursor-pointer text-[blue] whitespace-nowrap" onClick={() => handleVideo(items)}>{index + 1} Video</div>
                                                    <button className='text-[14px] px-4 font-[400] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a] ml-4' onClick={() => removeVideo(index)}>Remove</button>
                                                </div>
                                            </>
                                        )
                                    })

                                    : ""
                            }
                            <div className="flex items-center  w-full pt-4">
                                <input
                                    type="file"
                                    name="video"
                                    className="w-full "
                                    id="video"
                                    onChange={InputHandler}
                                    accept="video/mp4,video/x-m4v,video/*"
                                    disabled={videoDisable}
                                />
                            </div>
                        </div>
                        <div className="">
                            {
                                videoDisable ?
                                    <button className="p-2 border h-[20px] flex justify-center items-center" type="button" onClick={addField}>+</button> :
                                    <button className="focus-visible:outline-none bg-[#070708bd] text-white text-[13px] px-4 py-1 rounded" type="button" onClick={uploadVideo}>Upload</button>
                            }
                        </div>
                    </div>
                    <div className="mt-4 flex pt-6 items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
                        <button
                            type="button"
                            className="rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border border-[gray] bg-white text-black"
                        onClick={hideModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="custom-button rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border bg-[#1f2432] text-white"
                        >
                            Update
                        </button>
                    </div>

                </div>
            </form>


            <Transition appear show={openVideo} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeVideoModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title

                                        className="xl:text-[20px] text-[18px] text-right font-medium leading-6 text-gray-900"
                                    >
                                        close
                                    </Dialog.Title>

                                    <VideoPopup closeModal={closeVideoModal} data={videoview} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Editcategory