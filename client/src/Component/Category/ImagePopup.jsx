import React from 'react'

const ImagePopup = ({imgUrl}) => {
    console.log(imgUrl);
  return (
  <div className="">
    <img src={imgUrl} alt="" />
  </div>

  )
}

export default ImagePopup
