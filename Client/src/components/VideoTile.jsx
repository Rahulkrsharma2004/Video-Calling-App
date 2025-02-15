import React, { useRef, useEffect } from "react";

const VideoTile = React.forwardRef(({ stream, muted, isUser, name }, ref) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full h-full">
      <video
        ref={isUser ? ref : videoRef}
        autoPlay
        muted={isUser || muted}
        playsInline
        className="w-full h-full object-cover"
      />
      <div
        className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm text-white"
        aria-label={name || (isUser ? "You" : "Participant")}
      >
        {name || (isUser ? "You" : "Participant")}
      </div>
    </div>
  );
});

export default VideoTile;
