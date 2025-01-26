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

        const response = await fetch("http://127.0.0.1:5000/api/cool", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to generate captions. Please try again.");
        }

        const data = await response.json();

        // Check if data is valid JSON
        if (data && typeof data === "object" && data.meme_caption) {
          return data;
        } else {
          throw new Error("Invalid JSON response.");
        }
      } catch (err: any) {
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
    <div className="bg-neutral-200 rounded-lg shadow-lg p-6">
      {!uploadedImage ? (
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
      ) : (
        <>
          {error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <>
              <MemePreview imageUrl={uploadedImage} memeCaption={responseData.meme_caption} />
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
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Start Over
          </button>
        </>
      )}
    </div>
  );
}
