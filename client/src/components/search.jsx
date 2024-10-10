import React, { useState } from "react";
import '../assets/styles/search.css'

export default function Search(){
    const [more, setMore] = useState("false");
    return(
        <div className="serchContainer">
            
    <div>
        <p>Offer Type</p>
      <select className="select">
        <option value="" disabled>Type</option>
        <option value="option1">Rent</option>
        <option value="option2">Sale</option>
      </select>
    </div>
    <div className="location">
        <p>Location</p>
      <input type="text" placeholder="City/Location name" />
    </div>
            <div className="search">
                <br />
                <button>Search</button>
            </div>
            <button>Filter More</button>
        </div>
    
    )
}