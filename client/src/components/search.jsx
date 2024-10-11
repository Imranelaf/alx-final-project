import React, { useState } from "react";
import "../assets/styles/search.css";

export default function Search() {
  const [filters, setFilters] = useState({
    offerType: "",
    location: "",
    bathrooms: "",
    rooms: "",
    wifi: false,
    petFriendly: false,
    parking: false,
    priceMax: "",
    more: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filters applied:", filters);
    // Implement search logic here
  };

  return (
    <form className="serchContainer" onSubmit={handleSubmit}>
      <div className="OfferAndLocation">
        <div className="offer-type">
          <p>Offer Type</p>
          <select
            name="offerType"
            className="select"
            value={filters.offerType}
            onChange={handleInputChange}
          >
            <option value="" disabled hidden>
              Select Offer Type
            </option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>

        <div className="location">
          <p>Location</p>
          <input
            type="text"
            name="location"
            placeholder="City/Location name"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {filters.more && (
        <div className="filters show">
          <div className="filter-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              min="1"
              placeholder="e.g., 2"
              value={filters.bathrooms}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="rooms">Rooms</label>
            <input
              type="number"
              name="rooms"
              min="1"
              placeholder="e.g., 3"
              value={filters.rooms}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="priceMax">Price Maximum</label>
            <input
              type="number"
              name="priceMax"
              min="0"
              placeholder="e.g., 1000"
              value={filters.priceMax}
              onChange={handleInputChange}
            />
          </div>

          <div className="filter-group">
            <div className="checkbox-container">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="wifi"
                  id="wifi"
                  checked={filters.wifi}
                  onChange={handleInputChange}
                />
                <label htmlFor="wifi">WiFi</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="petFriendly"
                  id="petFriendly"
                  checked={filters.petFriendly}
                  onChange={handleInputChange}
                />
                <label htmlFor="petFriendly">Pet Friendly</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="parking"
                  id="parking"
                  checked={filters.parking}
                  onChange={handleInputChange}
                />
                <label htmlFor="parking">Parking</label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="actions">
        <button type="submit" className="button search-button">
          Search
        </button>
        <button
          type="button"
          className="button filter-button"
          onClick={() => setFilters({ ...filters, more: !filters.more })}
        >
          {filters.more ? "Hide Filters" : "More Filters"}
        </button>
      </div>
    </form>
  );
}