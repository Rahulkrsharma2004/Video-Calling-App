import React from "react";

const Controls = ({ muted, videoOn, toggleMute, toggleVideo, leaveCall }) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-800">
      <button
        onClick={toggleMute}
        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
      <button
        onClick={toggleVideo}
        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none"
      >
        {videoOn ? "Turn On Video" : "Turn Off Video"}
      </button>
      <button
        onClick={leaveCall}
        className="p-2 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none"
      >
        Leave Call
      </button>
    </div>
  );
};

export default Controls;