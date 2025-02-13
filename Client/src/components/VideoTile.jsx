import React, { useRef, useEffect } from "react";

const VideoTile = ({ stream, name }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-60 md:h-80 bg-gray-800 rounded-lg overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-gray-900 text-white px-2 py-1 rounded">
        {name}
      </div>
    </div>
  );
};

export default VideoTile;
