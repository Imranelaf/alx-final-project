import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import FAQ from "./pages/faq";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

