import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import VideoTile from "../components/VideoTile";
import Controls from "../components/Controls";

const socket = io("https://video-calling-app-brown.vercel.app");

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const userVideoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        socket.emit("join-room", roomId);
      });

    socket.on("user-connected", (userId) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("signal", userId, signal);
      });

      peer.on("stream", (remoteStream) => {
        setPeers((prevPeers) => [...prevPeers, { id: userId, stream: remoteStream }]);
      });

      socket.on("signal", (signal) => {
        peer.signal(signal);
      });

      socket.on("user-disconnected", (userId) => {
        setPeers((prevPeers) => prevPeers.filter((peer) => peer.id !== userId));
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const toggleMute = () => {
    setMuted(!muted);
    stream.getAudioTracks()[0].enabled = !muted;
  };

  const toggleVideo = () => {
    setVideoOn(!videoOn);
    stream.getVideoTracks()[0].enabled = videoOn;
  };

  const leaveCall = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-[#1A1E2C] text-white">
      <div className="p-4 bg-[#2A2F42] shadow-md">
        <h1 className="text-xl font-bold">Video Call Room</h1>
        <p className="text-sm text-gray-400">Room ID: {roomId}</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <VideoTile stream={stream} muted={muted} isUser={true} ref={userVideoRef} />
        {peers.map((peer) => (
          <VideoTile key={peer.id} stream={peer.stream} muted={false} isUser={false} />
        ))}
      </div>

      <Controls
        muted={muted}
        videoOn={videoOn}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        leaveCall={leaveCall}
      />
    </div>
  );
};

export default Room;
