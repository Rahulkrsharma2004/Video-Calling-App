import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const createRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name before creating a room!");
      return;
    }
    const newRoomId = uuidV4();
    navigate(`/room/${newRoomId}?name=${encodeURIComponent(userName)}`);
  };

  const joinExistingRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name before joining a room!");
      return;
    }
    if (roomId.trim() === "") {
      alert("Please enter a valid Room ID!");
      return;
    }
    navigate(`/room/${roomId}?name=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Video Call App</h1>

      {/* Input for Username */}
      <input
        type="text"
        placeholder="Enter Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-2 mb-4 rounded-lg text-black w-64"
      />

      <button
        onClick={createRoom}
        className="px-6 py-2 bg-blue-500 rounded-lg text-lg mb-4">
        Create New Room
      </button>

      <div className="flex">
        {/* Input for Room ID */}
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-48"
        />
        <button
          onClick={joinExistingRoom}
          className="ml-2 px-6 py-2 bg-green-500 rounded-lg text-lg">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
