import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import FAQ from "./pages/faq";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} /> {/* Updated route path to /faq */}
    </Routes>
  );
}

export default App;

