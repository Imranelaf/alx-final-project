import React from "react";
import Navbar from "../components/navbar";
import Search from "../components/search";
import Card from "../components/card";



export default function Home(){
   return( <>
    <Navbar />
    <Search />
    <Card /> 
   </>)
}