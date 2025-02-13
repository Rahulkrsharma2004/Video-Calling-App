import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import Peer from "simple-peer";
import VideoTile from "./VideoTile";

const VideoCall = ({ roomId }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const userStream = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userStream.current = stream;
      userVideo.current.srcObject = stream;

      socket.emit("join-room", roomId, socket.id);

      socket.on("user-connected", (userId) => {
        const peer = createPeer(userId, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers((prev) => [...prev, peer]);
      });

      socket.on("user-disconnected", (userId) => {
        setPeers((prev) => prev.filter((p) => p.peerID !== userId));
      });
    });
  }, [roomId]);

  function createPeer(userId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("send-signal", { userId, signal });
    });

    return peer;
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="w-full max-w-2xl grid grid-cols-2 gap-2">
        <VideoTile stream={userStream.current} name="You" />
        {peers.map((peer, index) => (
          <VideoTile key={index} stream={peer.stream} name={`User ${index + 1}`} />
        ))}
      </div>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => userStream.current.getTracks().forEach(track => track.stop())}>
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
