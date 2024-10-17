import React from "react";

export default function ImageUpload({ handleFileChange, createImagePreviews }) {
  return (
    <>
      <label htmlFor="images">Upload Images</label>
      <input
        type="file"
        name="images"
        id="images"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <div className="image-previews">{createImagePreviews()}</div>
    </>
  );
}
