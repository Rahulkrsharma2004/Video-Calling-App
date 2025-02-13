import React, { useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react"; 

const VideoTile = React.forwardRef(({ stream, muted, isUser }, ref) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-black m-auto flex justify-center items-center rounded-lg overflow-hidden w-full h-full max-w-[300px] max-h-[300px]">
      <video
        ref={isUser ? ref : videoRef}
        autoPlay
        muted={muted}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm text-white">
        {isUser ? "You" : "Participant"}
      </div>

      <div className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full">
        {muted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
      </div>
    </div>
  );
});

export default VideoTile;
