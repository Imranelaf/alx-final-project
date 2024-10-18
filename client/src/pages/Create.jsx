import React, { useState } from "react";
import axios from "axios";
import '../assets/styles/create.css';
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
import TextFieldsAndCheckbox from "../components/TextFieldsAndCheckbox";
import ImageUpload from "../components/ImageUpload";
import Footer from "../components/Footer";

export default function Create() {
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    id: currentUser._id,
    name: '',
    description: '',
    address: '',
    phone: '',
    rent: true,
    sell: false,
    parking: false,
    wifi: false,
    petFriendly: false,
    rooms: '',
    bathrooms: '',
    price: '',
    image: []
  });

  // Handle file input change
  const handleFileChange = (event) => {
    setImages([...event.target.files]);
  };

  // Handle text and checkbox changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      if (name === "rent") {
        setData((prev) => ({
          ...prev,
          rent: checked,
          sell: !checked, // Automatically toggle sell to false when rent is true
        }));
      } else if (name === "sell") {
        setData((prev) => ({
          ...prev,
          sell: checked,
          rent: !checked, // and vice-versa
        }));
      } else {
        setData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const imageUrls = [];

    for (const image of images) {
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        imageUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        alert("Error during uploading image");
        return;
      }
    }

    // Update state with image URLs before sending data to backend
    const updatedData = { ...data, image: imageUrls };

    console.log(updatedData); // for testing delete in final version
    console.log(currentUser);

    // Sending the data to the backend
    try {
      await axios.post(`${API_URL}/create-listing`, updatedData); // Update the API endpoint accordingly
      console.log("Listing created successfully");
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  // Create image previews
  const createImagePreviews = () => {
    return Array.from(images).map((file, index) => {
      const url = URL.createObjectURL(file);
      return (
        <img
          key={index}
          src={url}
          alt={`preview ${index}`}
          style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
        />
      );
    });
  };

  return (
    <>
      <Navbar />

      <div className="creating-container">
        <h2>CREATE LISTING</h2>
        <form className="creating" onSubmit={handleSubmit}>
          <TextFieldsAndCheckbox data={data} handleChange={handleChange} />
          <ImageUpload handleFileChange={handleFileChange} createImagePreviews={createImagePreviews} />

          <button type="submit">Create</button>
        </form>
      </div>
      
      <Footer />
    </>
  );
}
