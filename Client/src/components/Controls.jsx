import React from "react";

const Controls = ({ muted, videoOn, toggleMute, toggleVideo, leaveCall }) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-[#2A2F42] shadow-lg">
      <button
        onClick={toggleMute}
        className="p-3 bg-[#3A3F52] rounded-full hover:bg-[#4A4F62] focus:outline-none transition duration-300"
      >
        {muted ? "🔇" : "🎤"}
      </button>
      <button
        onClick={toggleVideo}
        className="p-3 bg-[#3A3F52] rounded-full hover:bg-[#4A4F62] focus:outline-none transition duration-300"
      >
        {videoOn ? "📹" : "📴"}
      </button>
      <button
        onClick={leaveCall}
        className="p-3 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none transition duration-300"
      >
        🚪 Leave
      </button>
    </div>
  );
};

export default Controls;
