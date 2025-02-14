import React, { useEffect, useRef } from "react";

const VideoTile = React.forwardRef(({ stream, muted, isUser }, ref) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-[#2A2F42] rounded-lg overflow-hidden shadow-lg">
      <video
        ref={isUser ? ref : videoRef}
        autoPlay
        muted={isUser || muted}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
        {isUser ? "You" : "Participant"}
      </div>
    </div>
  );
});

export default VideoTile;
