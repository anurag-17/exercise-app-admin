import React, { useState } from "react";

const Pagination = ({
  currentpage,
  totalCount,
  visiblePageCount,
  getAllData,
}) => {
  const [currentPage, setCurrentPage] = useState(currentpage || 1);

  const calculatePageRange = () => {
    const pageRange = [];
    let startPage = Math.max(1, currentpage - Math.floor(visiblePageCount / 2));
    let endPage = Math.min(totalCount, startPage + visiblePageCount - 1);

    if (endPage - startPage + 1 < visiblePageCount) {
      startPage = Math.max(1, endPage - visiblePageCount + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }
    return pageRange;
  };

  const pageRange = calculatePageRange();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getAllData(pageNumber);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-[13px] font-[400] text-[#131212]">
          {currentpage} out of {totalCount} Pages
        </div>
        <div className="flex gap-x-3 ext-[13px] font-[400] text-[#131212]">
          {currentPage > 1 && (
            <button
              className="text-[13px] font-[400] text-[#131212] mr-1 border px-3 rounded"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}

          {/* {/ {/ Render page buttons /} /} */}
          {pageRange.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`btn border border-black rounded-[50px] h-[24px] w-[24px] text-[12px] font-semibold flex justify-center items-center text-center
               ${currentPage === pageNumber ? "bg-black text-white " : ""}`}  >
              {pageNumber}
            </button>
          ))}

          {/* {/ {/ Render next button /} /} */}
          {currentPage < totalCount && (
            <button
              className="text-[12px] font-[400] text-[#131212] border px-3 rounded"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Pagination;
