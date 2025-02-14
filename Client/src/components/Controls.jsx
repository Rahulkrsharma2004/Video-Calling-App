import React from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaPhone } from "react-icons/fa";

const Controls = ({ muted, videoOn, toggleMute, toggleVideo, leaveCall }) => {
  return (
    <div className="flex justify-center space-x-6 p-4 bg-gray-900 shadow-lg">
      {/* Mute/Unmute Button */}
      <button 
        onClick={toggleMute} 
        className={`p-4 rounded-full transition ${
          muted ? "bg-red-600 hover:bg-red-500" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {muted ? <FaMicrophoneSlash className="text-white text-2xl" /> : <FaMicrophone className="text-white text-2xl" />}
      </button>

      {/* Video On/Off Button */}
      <button 
        onClick={toggleVideo} 
        className={`p-4 rounded-full transition ${
          videoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {videoOn ? <FaVideo className="text-white text-2xl" /> : <FaVideoSlash className="text-white text-2xl" />}
      </button>
      <button 
        onClick={leaveCall} 
        className="p-4 bg-red-600 rounded-full hover:bg-red-500 transition"
      >
        <FaPhone className="text-white text-2xl" />
      </button>
    </div>
  );
};

export default Controls;
