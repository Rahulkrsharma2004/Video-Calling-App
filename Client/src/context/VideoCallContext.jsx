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
  const peerConnections = useRef({});

  // ✅ Move createPeer outside useEffect
  const createPeer = (userId, stream, initiator, name) => {
    if (!stream) {
      console.error("Stream is null when creating peer for:", userId);
      return;
    }

    console.log(`Creating peer: ID=${userId}, Name=${name}, Initiator=${initiator}`);

    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (initiator) {
        socket.emit("offer", { userId, signal });
      } else {
        socket.emit("answer", { userId, signal });
      }
    });

    peer.on("stream", (remoteStream) => {
      setPeers((prevPeers) => [...prevPeers, { id: userId, stream: remoteStream, name }]);
    });

    peerConnections.current[userId] = peer;
  };

  useEffect(() => {
    if (!roomId || !stream) return;

    const handleUserList = (users) => {
      users.forEach(({ socketId, name }) => {
        if (!peerConnections.current[socketId]) {
          createPeer(socketId, stream, true, name);
        }
      });
    };

    const handleOffer = ({ userId, signal, name }) => {
      if (!peerConnections.current[userId]) {
        createPeer(userId, stream, false, name);
      }
      peerConnections.current[userId]?.signal(signal);
    };

    const handleAnswer = ({ userId, signal }) => {
      peerConnections.current[userId]?.signal(signal);
    };

    const handleUserDisconnected = (userId) => {
      setPeers((prevPeers) => prevPeers.filter((p) => p.id !== userId));
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].destroy();
        delete peerConnections.current[userId];
      }
    };

    socket.on("user-list", handleUserList);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
      socket.off("user-list", handleUserList);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("user-disconnected", handleUserDisconnected);
    };
  }, [roomId, stream]);

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    socket.emit("join-room", { roomId, name: userName });
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
    setMuted((prevMuted) => !prevMuted);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
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
