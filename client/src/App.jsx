import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import FAQ from "./pages/FAQ";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SignupSuccess from "./pages/SignupSuccess";
import SignupFailure from "./pages/SignupFailure";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/success" element={<SignupSuccess />} />
      <Route path="/signup/failure" element={<SignupFailure />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;

