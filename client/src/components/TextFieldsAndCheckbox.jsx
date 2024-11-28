import React from "react";

export default function TextFieldsAndCheckbox({ data, handleChange }) {
  return (
    <>
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={data.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={data.description}
        onChange={handleChange}
        required
      />

      {/* Address Fields */}
      <input
        type="text"
        placeholder="Street Address"
        name="address.street"
        value={data.address.street}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        placeholder="City"
        name="address.city"
        value={data.address.city}
        onChange={handleChange}
        required
      />

      {/* Phone Number */}
      <input
        type="text"
        placeholder="Phone"
        name="phoneNumber"
        min={10}
        max={13}
        value={data.phone}
        onChange={handleChange}
        required
      />

      {/* Property Type */}
      <p>Property Type</p>
      <select
        name="propertyType"
        value={data.propertyType}
        onChange={handleChange}
        className="propertyType"
        required
      >
        <option value="">Select Property Type</option>
        <option value="Apartment">Apartment</option>
        <option value="House">House</option>
        <option value="Villa">Villa</option>
        <option value="Office">Office</option>
        <option value="Studio">Studio</option>
      </select>

      {/* Size */}
      <label htmlFor="size">Size (sq. ft / m²) "Optional"</label>
      <input
        type="number"
        name="size"
        value={data.size}
        onChange={handleChange}
        required
      />

      {/* Rooms */}
      <label htmlFor="rooms">Rooms</label>
      <input
        type="number"
        name="rooms"
        min="1"
        value={data.rooms}
        onChange={handleChange}
        required
      />

      {/* Bathrooms */}
      <label htmlFor="bathrooms">Bathrooms</label>
      <input
        type="number"
        name="bathrooms"
        min="1"
        value={data.bathrooms}
        onChange={handleChange}
        required
      />

      {/* Bedrooms */}
      <label htmlFor="bedrooms">Bedrooms</label>
      <input
        type="number"
        name="bedrooms"
        min="1"
        value={data.bedrooms}
        onChange={handleChange}
        required
      />

      {/* Offer Type: Rent or Sell as a Dropdown */}
      <h3>This is for?</h3>
      <select
        name="offerType"
        value={data.offerType}
        onChange={handleChange}
        className="offer-type"
        required
      >
        <option value="">Select Offer Type</option>
        <option value="Rent">Rent</option>
        <option value="Sale">Sale</option>
      </select>

      {/* Additional Features: Parking, Wi-Fi, Pet-Friendly */}
      <h3>Include :</h3>
      <div className="check">
        <label htmlFor="parking" className="cheking">
          Parking
          <input
            type="checkbox"
            name="parking"
            id="parking"
            className="checkbox"
            checked={data.parking}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="wifi" className="cheking">
          Wi-Fi
          <input
            type="checkbox"
            name="wifi"
            id="wifi"
            className="checkbox"
            checked={data.wifi}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="petFriendly" className="cheking">
          Pet-friendly
          <input
            type="checkbox"
            name="petFriendly"
            id="petFriendly"
            className="checkbox"
            checked={data.petFriendly}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Price */}
      <label htmlFor="price">Price</label>
      <div className="price">
        <input
          type="number"
          name="price"
          min="0"
          id="price"
          value={data.price}
          onChange={handleChange}
          required
        />
        <p>{data.offerType === "Rent" ? "$ / month" : "$"}</p>
      </div>
    </>
  );
}
