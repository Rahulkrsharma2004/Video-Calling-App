import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import Peer from "simple-peer";
import socket from "../utils/socket";

const VideoCallContext = createContext();

export const useVideoCall = () => useContext(VideoCallContext);

export const VideoCallProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const userVideoRef = useRef();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket.on("user-connected", ({ userId, name }) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (signal) => socket.emit("signal", { userId, signal }));
      peer.on("stream", (remoteStream) =>
        setPeers((prev) => [...prev, { id: userId, stream: remoteStream, name }])
      );

      socket.on("signal", ({ userId, signal }) => peer.signal(signal));
      socket.on("user-disconnected", (userId) =>
        setPeers((prev) => prev.filter((p) => p.id !== userId))
      );
    });

    return () => socket.disconnect();
  }, [stream, roomId]);

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    socket.emit("join-room", { roomId, name: userName });
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
    setMuted((prevMuted) => !prevMuted);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
    setVideoOn((prevVideoOn) => !prevVideoOn);
  };

  return (
    <VideoCallContext.Provider
      value={{
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
        setUserName,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
