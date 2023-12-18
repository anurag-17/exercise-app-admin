import React from 'react'

const VideoPopup = (url) => {
    console.log(url);
  return (
    <video controls>
      <source src={url?.data} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

  )
}

export default VideoPopup