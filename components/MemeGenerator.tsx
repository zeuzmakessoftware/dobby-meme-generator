"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import MemePreview from "./MemePreview";
import MiscellaneousData from "./MiscellaneousData";

export default function MemeGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(true); // For toggle state

  const handleImageUpload = async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);

    const maxRetries = 10;
    let attempt = 0;

    const fetchResponse = async (): Promise<any> => {
      attempt++;
      try {
        const base64Response = await fetch(imageDataUrl);
        const blob = await base64Response.blob();
        const file = new File([blob], "uploaded_image.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5001/api/cool", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to generate captions. Please try again.");
        }

        const data = await response.json();

        console.log("data -->", data);

        // Check if data is valid JSON
        if (data && typeof data === "object" && data.meme_caption) {
          return data;
        } else {
          throw new Error("Invalid JSON response.");
        }
      } catch (err: any) {
        console.error(err);
        if (attempt < maxRetries) {
          return fetchResponse(); // Retry
        }
        throw err; // Exceed max retries
      }
    };

    try {
      const data = await fetchResponse();
      setUploadedImage(imageDataUrl);
      setResponseData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <div
      className="bg-neutral-200 rounded-lg shadow-lg p-6"
    >
      {!uploadedImage ? (
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
      ) : (
        <>
          {error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <>
              <div
                className="toggle-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <button
                  onClick={() => setShowOriginal(true)}
                  style={{
                    padding: "0.5rem 1rem",
                    marginRight: "0.5rem",
                    borderRadius: "8px",
                    backgroundColor: showOriginal ? "#d1d5db" : "#e5e7eb",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: showOriginal ? "bold" : "normal",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Original Meme
                </button>
                <button
                  onClick={() => setShowOriginal(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: !showOriginal ? "#d1d5db" : "#e5e7eb",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: !showOriginal ? "bold" : "normal",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Objectified Meme
                </button>
              </div>

              <div className="meme-content" style={{ textAlign: "center" }}>
                {showOriginal ? (
                  <MemePreview
                    imageUrl={uploadedImage}
                    memeCaption={responseData?.meme_caption}
                  />
                ) : (
                  <MemePreview
                    imageUrl={responseData?.output_img}
                    memeCaption={responseData?.meme_caption}
                  />
                )}
              </div>

              {responseData && (
                <MiscellaneousData
                  memeTitle={responseData.meme_caption}
                  hashtags={responseData.hashtags}
                  description={responseData.funny_description_caption}
                />
              )}
            </>
          )}
          <button
            onClick={handleStartOver}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#d1d5db")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5e7eb")
            }
          >
            Start Over
          </button>
        </>
      )}
    </div>
  );
}
