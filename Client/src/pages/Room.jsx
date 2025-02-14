import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useVideoCall } from "../context/VideoCallContext";
import VideoTile from "../components/VideoTile";
import Controls from "../components/Controls";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To access the URL parameters
  const {
    stream,
    peers,
    muted,
    videoOn,
    userVideoRef,
    joinRoom,
    toggleMute,
    toggleVideo,
    setStream,
    userName,
  } = useVideoCall();

  const userNameFromUrl = new URLSearchParams(location.search).get("name") || userName;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = mediaStream;
        }
        joinRoom(roomId);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, [roomId]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <VideoTile 
          stream={stream} 
          muted={muted} 
          isUser={true} 
          name={userNameFromUrl} 
          ref={userVideoRef} 
        />
        {peers.map((peer) => (
          <VideoTile 
            key={peer.id} 
            stream={peer.stream} 
            muted={false} 
            isUser={false} 
            name={peer.name} 
          />
        ))}
      </div>
      <Controls 
        muted={muted} 
        videoOn={videoOn} 
        toggleMute={toggleMute} 
        toggleVideo={toggleVideo} 
        leaveCall={() => navigate("/")}
      />
    </div>
  );
};

export default Room;
