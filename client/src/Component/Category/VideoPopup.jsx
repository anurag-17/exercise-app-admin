import React, { useEffect, useRef } from 'react'

const VideoPopup = (url) => {

    // const videoRef = useRef(null);

    // useEffect(() => {
    //   const video = videoRef.current;
  
    //   const handlePlay = () => {
    //     const startTime = video.currentTime;
    //     console.log(`Video started playing at ${startTime} seconds`);
    //     console.log(Date.now())
    //     // Optionally, you can remove the event listener after the first play
    //     video.removeEventListener('play', handlePlay);
    //   };
  
    //   if (video) {
    //     video.addEventListener('play', handlePlay);
    //   }
  
    //   // Cleanup: remove the event listener when the component unmounts
    //   return () => {
    //     if (video) {
    //       video.removeEventListener('play', handlePlay);
    //     }
    //   };
    // }, []); 


  return (
    <video controls  >
      <source src={url?.data} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

  )
}

export default VideoPopup