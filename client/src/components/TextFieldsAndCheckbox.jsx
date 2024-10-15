import React from "react";

export default function TextFieldsAndCheckbox({ data, handleChange }) {
  return (
    <>
      <input type="text" placeholder="Name" name="name" onChange={handleChange} />
      <input type="text" placeholder="Description" name="description" onChange={handleChange} />
      <input type="text" placeholder="Address" name="address" onChange={handleChange} required />
      <input type="text" placeholder="Phone" name="phone" onChange={handleChange} />

      <div className="check">
        <p>This is for?</p> <br/>
        <label htmlFor="rent">Rent</label>
        <input
          type="checkbox"
          name="rent"
          id="rent"
          checked={data.rent}
          onChange={handleChange}
        />

        <label htmlFor="sell">Sell</label>
        <input
          type="checkbox"
          name="sell"
          id="sell"
          checked={data.sell}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="parking">Parking</label>
        <input type="checkbox" name="parking" id="parking" onChange={handleChange} />

        <label htmlFor="wifi">WI-FI</label>
        <input type="checkbox" name="wifi" id="wifi" onChange={handleChange} />

        <label htmlFor="petFriendly">Pet-friendly</label>
        <input type="checkbox" name="petFriendly" id="petFriendly" onChange={handleChange} />
      </div>

      <label htmlFor="rooms">Rooms</label>
      <input type="number" name="rooms" id="rooms" onChange={handleChange} required />

      <label htmlFor="bathrooms">Bathrooms</label>
      <input type="number" name="bathrooms" id="bathrooms" onChange={handleChange} required />

      <label htmlFor="price">Price</label>
      <div className="price">
        <input type="number" name="price" id="price" onChange={handleChange} required />
        <p>{data.rent ? "$ / night" : "$"}</p>
      </div>
    </>
  );
}
