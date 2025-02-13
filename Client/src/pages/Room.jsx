import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

const Room = () => {
  const { roomId } = useParams();
  return <VideoCall roomId={roomId} />;
};

export default Room;
