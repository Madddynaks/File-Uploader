import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { user, loginWithPopup, logout, isAuthenticated } = useAuth0();

  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Show preview of the file
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setPreviewSrc(event.target.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedUrl(response.data.url); // Store the Cloudinary URL
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("File upload failed.");
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div>
          <button onClick={(e) => logout()}>Logout</button>
        </div>
      )}
      {!isAuthenticated && (
        <div>
          <button onClick={(e) => loginWithPopup()}>Login</button>
          <div>You need to Login to view the content</div>
        </div>
      )}
      {isAuthenticated && (
        <div className="App" style={{ padding: "20px" }}>
          <h2>File Upload with Preview and Cloudinary</h2>

          {/* File Input */}
          <input type="file" onChange={handleFileChange} />

          {/* Preview of the selected file */}
          {previewSrc && (
            <div>
              <h3>Preview:</h3>
              {file.type.startsWith("image") && (
                <img
                  src={previewSrc}
                  alt="Preview"
                  style={{ width: "300px", margin: "10px 0" }}
                />
              )}
              {file.type.startsWith("video") && (
                <video src={previewSrc} controls width="300" />
              )}
              {file.type === "application/pdf" && (
                <embed src={previewSrc} width="300" height="400" />
              )}
            </div>
          )}

          {/* Upload Button */}
          <button onClick={handleUpload} style={{ marginTop: "10px" }}>
            Upload
          </button>

          {/* Display uploaded URL */}
          {uploadedUrl && (
            <div>
              <h3>Uploaded File:</h3>
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                {uploadedUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default App;
