import React from "react";

export default function TextFieldsAndCheckbox({ data, handleChange }) {
  return (
    <>
      <input type="text" placeholder="Name" name="name" onChange={handleChange} />
      <input type="text" placeholder="Description" name="description" onChange={handleChange} />
      <input type="text" placeholder="Address" name="address" onChange={handleChange} required />
      <input type="text" placeholder="Phone" name="phone" onChange={handleChange} />
      <h3>This is for?</h3> 
      <div className="check">
  <label htmlFor="rent" className="cheking">Rent  
    <input
      type="checkbox"
      name="rent"
      id="rent"
      checked={data.rent}
      onChange={handleChange}
    />
  </label>

  <label htmlFor="sell" className="cheking">Sell 
    <input
      type="checkbox"
      name="sell"
      id="sell"
      checked={data.sell}
      onChange={handleChange}
    />
  </label>
</div>

      <h3>Include :</h3>
      <div className="check">
        <label htmlFor="parking" className="cheking">Parking <input type="checkbox" name="parking" id="parking" onChange={handleChange} /></label>
        

        <label htmlFor="wifi" className="cheking">WI-FI  <input type="checkbox" name="wifi" id="wifi" onChange={handleChange} /></label>
       

        <label htmlFor="petFriendly" className="cheking">Pet-friendly <input type="checkbox" name="petFriendly" id="petFriendly" onChange={handleChange} /></label>
        
      </div>

      <label htmlFor="rooms">Rooms</label>
      <input type="number" name="rooms" min="1" id="rooms" onChange={handleChange} required />

      <label htmlFor="bathrooms">Bathrooms</label>
      <input type="number" name="bathrooms" min="1" id="bathrooms" onChange={handleChange} required />

      <label htmlFor="price" >Price</label>
      <div className="price">
        <input type="number" name="price" min="0" id="price" onChange={handleChange} required />
        <p>{data.rent ? "$ / night" : "$"}</p>
      </div>
    </>
  );
}
