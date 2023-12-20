import React, { Fragment, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

import Pagination from "../Pagination/Index";
import DeleteUser from "./DeleteUser";
import Loader from "../WebsiiteLoader/Index";
import Backarrow from "../Svg/Backarrow";
import CloseIcon from "../Svg/CloseIcon";

export const headItems = ["S. No.", "Name", " Contact No", "Email", "Action"]


const User = () => {

  const navigate = useNavigate();
  let [allData, setAllData] = useState([])
  let [openDelete, setOpenDelete] = useState(false)
  let [isLoader, setLoader] = useState(false)
  let [updateId, setUpdateId] = useState("")
  const [isRefresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState("");
  const visiblePageCount = 10
  const token = JSON.parse(sessionStorage.getItem("sessionToken"))

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


  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    searchDataFunc(e.target.value);
  };

  const handleSearch = () => {
    if (searchText) {
      searchDataFunc(searchText.trim());
    }
  };

  const handleKeyDown = (e) => {
    console.log("Pressed key:", e.key);
    if (e.key === "Backspace") {
      // e.preventDefault(); // Prevent the default action
      searchDataFunc(searchText);
    }
  };

  const handleClearSearch = () => {
    refreshdata();
    setSearchText("");
  };

  const searchDataFunc = (search_cate) => {
    const options = {
      method: "GET",
      url: `/api/auth/viewUser?search=${search_cate}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response?.data);
        if (response.status === 200) {
          setAllData(response?.data);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <>
      {
        isLoader && <Loader />
      }
      <section className="py-[30px] px-[20px] mt-[20px] lg:mt-0">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[15px] flex justify-between items-center px-[20px]">
            <p className=" text-[22px] font-semibold">User list</p>
            <div className="flex gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3  items-center justify-center md:justify-end">
              <div className="border border-[gray] rounded-[5px] bg-[#302f2f82]] flex justify-center items-center h-[32px] pl-[10px] md:w-auto w-full">
                <input
                  type="text"
                  className="focus-visible:outline-none border-none w-full rounded-[5px] font-normal text-[15px] text-[#6a6969] placeholder:text-[11px]"
                  value={searchText}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name, contact, email."
                />
                {searchText !== "" ? (
                  <button
                    className="px-1 rounded text-[12px] text-[gray] border border-[#6a696917] hover:text-black mr-1"
                    onClick={handleClearSearch}
                  >
                   <CloseIcon />
                  </button>
                ) : (
                  ""
                )}
                <button
                  className="px-6 rounded text-[12px] text-[gray] h-[32px] bg-[#6a696917] hover:text-black"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
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


          </div>


          {
            Array.isArray(allData?.users) && allData?.users?.length === 0  &&

            <div className="py-4 px-4 w-full flex flex-col items-center justify-center border border-[#f3f3f3] bg-white rounded-[20px] mt-[10px]">
              <p className="text-[18px] fontsemibold">No data</p>
            </div>
          }
        </div>

        {allData?.pagination?.totalPages > 1 && (
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
