import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { VideoCallProvider } from "./context/VideoCallContext";

const App = () => {
  return (
    <VideoCallProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </VideoCallProvider>
  );
};

export default App;
