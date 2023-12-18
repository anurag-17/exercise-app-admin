import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const DeleteUser = ({ deleteId, closeModal, refreshdata }) => {

  const [isLoading, setLoading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"))
  const handleClose = () => {
    closeModal();
  };

  const handleDelete = (e) => {
    
    e.preventDefault();
    setLoading(true);

    const options = {
      method: "DELETE",
      url: `/api/auth/deleteUser/${deleteId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response);
        if (response.status === 200) {
          setLoading(false);
          toast.success("Deleted successfully !");
          handleClose();
          refreshdata();
        } else {
          setLoading(false);
          toast.error("Failed. something went wrong!");
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
        toast.error("Failed. something went wrong!");
      });
  };

  return (
    <>
      <div className="mt-2">
        <p className=" text-[16px] font-normal leading-[30px] text-gray-500 mt-4">
          Are you sure you want to delete this user ?
        </p>
      </div>

      <div className="mt-8">
        <div className="flex justify-between gap-x-5">
          <button
            className="w-full px-4 text-[13px] border rounded text-[gray]  py-2 hover:bg-[#80808045] focus-visible:outline-none"
            onClick={handleClose}
          >
            No, Keep It
          </button>
        
            <button
              className={`w-full px-4 text-[13px] border rounded py-2 text-red-700 focus-visible:outline-none
              ${isLoading ?  "text-[gray]" : "text-[red] hover:bg-[#efb3b38a]" }`}
              onClick={handleDelete}
            >
              { isLoading ? "Loading..." : "Yes, Delete It" }
            </button>
        </div>
      </div>
    </>
  );
};

export default DeleteUser;
