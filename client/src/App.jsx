import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import FAQ from "./pages/FAQ";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { AuthSuccess, AuthFailure } from "./pages/AuthStatus";
import Profile from "./pages/Profile";
import Create from "./pages/Create";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/success" element={<AuthSuccess type="SignUp" />} /> 
      <Route path="/signup/failure" element={<AuthFailure type="SignUp" />} /> 
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signin/success" element={<AuthSuccess type="SignIn" />} /> 
      <Route path="/signin/failure" element={<AuthFailure type="SignIn" />} /> 
      <Route path="/profile" element={<Profile/>} /> 
      <Route path="/create" element={<Create/>} /> 

    </Routes>
    </BrowserRouter>
  );
}

export default App;

