import React, { Fragment, useState, useEffect } from "react"
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import Pagination from "../Pagination/Index";
import DeleteUser from "./DeleteUser";
import Loader from "../WebsiiteLoader/Index";

export const headItems = ["S. No.", "Name", " Contact No", "Email", "Action"]


const User = () => {
  let [allData, setAllData] = useState([])
  let [isOpen, setIsOpen] = useState(false)
  let [openEdit, setOpenEdit] = useState(false)
  let [openDelete, setOpenDelete] = useState(false)
  let [isLoader, setLoader] = useState(false)
  let [updateId, setUpdateId] = useState("")
  const [isRefresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState([]);
  const visiblePageCount = 15
  const token = JSON.parse(sessionStorage.getItem("sessionToken"))
  // all data
  useEffect(() => {
    getAllData(1);
  }, [isRefresh]);

  const getAllData = (pageNo) => {
    setLoader(true)
    const options = {
      method: "GET",
      url: `/api/auth/viewUser?page=${pageNo}&limit=${visiblePageCount}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response?.data);
        if (response.status === 200) {
          setLoader(false)
          setAllData(response?.data);
        }
        else {
          setLoader(false)
          return
        }
      })
      .catch((error) => {
        setLoader(false)
        console.error("Error:", error);
      });
  };


  const closeModal = () => {
    setIsOpen(false)
  }



  const handleDelete = (id) => {
    setUpdateId(id)
    setOpenDelete(true)
  }

  const closeDeleteModal = () => {
    setOpenDelete(false)
  }

  const refreshdata = () => {
    setRefresh(!isRefresh)
  }



  return (
    <>
      {
        isLoader && <Loader />
      }
      <section className="py-[40px] px-[20px] mt-[20px] lg:mt-0">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[15px] flex justify-between items-center px-[20px]">
            <p className=" text-[22px] font-semibold">User list</p>
          </div>
          <div className="rounded-[10px] bg-white py-[30px] px-[20px] flex justify-between items-center mt-[20px] p-6 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto mt-[20px] ">
              <thead className="">
                <tr className=" ">
                  {headItems.map((items, inx) => (
                    <th className="py-3 px-5 text-left bg-white" key={inx}>
                      <p className="block text-[13px] font-medium uppercase text-[#72727b]"> {items}</p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {  Array.isArray(allData?.users) && 
                  allData?.users?.length > 0 &&
                  allData?.users?.map((items, index) => (
                    <tr key={index}>
                      <td className="text-[14px] font-[400] py-3 px-5">{index + 1}</td>
                      <td className="text-[14px] font-[400] py-3 px-5 capitalize">{items?.name}</td>
                      <td className="text-[14px] font-[400] py-3 px-5">{items?.contact} </td>
                      <td className="text-[14px] font-[400] py-3 px-5">{items?.email}</td>
                      <td className="text-[14px] font-[400] py-3 px-5">
                        <div className="flex flex-col md:flex-row items-center gap-x-5">
                          <button className="px-4 text-[13px] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a]"
                            onClick={() => handleDelete(items?._id)}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>


            {
            Array.isArray(allData?.users) && allData?.users?.length === 0  &&

            <div className="py-4 px-4 w-full flex flex-col items-center justify-center border border-[#f3f3f3] bg-white rounded-[20px] mt-[10px]">
              <p className="text-[18px] fontsemibold">No data</p>
            </div>
          }
          </div>
        </div>

        {allData?.totalPages > 1 && (
          <Pagination
            currentpage={allData?.pagination?.currentPage}
            totalCount={allData?.pagination?.totalPages}
            visiblePageCount={visiblePageCount}
            getAllData={getAllData}
          />
        )}

      </section>

      {/*---------- Delete popup---------- */}

      <Transition appear show={openDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
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
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Delete user
                  </Dialog.Title>
                  <DeleteUser closeModal={closeDeleteModal} refreshdata={refreshdata} deleteId={updateId} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
};

export default User;
