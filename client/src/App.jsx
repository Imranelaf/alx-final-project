import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import About from "./pages/about";
import Home from "./pages/home";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        
      </Routes>
  );
}

export default App;