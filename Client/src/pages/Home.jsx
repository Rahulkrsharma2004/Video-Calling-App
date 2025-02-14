import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Join a Video Call</h1>
      <input 
        type="text" 
        placeholder="Enter Room ID" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)} 
        className="p-2 border rounded text-black"
      />
      <button 
        onClick={handleJoinRoom} 
        className="mt-2 px-4 py-2 bg-blue-500 rounded"
        disabled={!roomId.trim()}
      >
        Join Room
      </button>
    </div>
  );
};

export default Home;
