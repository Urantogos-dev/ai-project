"use client";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";

// Илрүүлсэн орцын төрлийг тодорхойлно
type DetectedIngredient = {
  label: string;
  score?: number;
};

export const Steptwo = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [detectedObjects, setDetectedObjects] = useState<DetectedIngredient[]>(
    [],
  );
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Зураг сонгоход ажиллах функц
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file); // Сонгосон зургийг дэлгэцэд харуулах URL үүсгэнэ
      setUploadedImageUrl(url);
      setDetectedObjects([]);
    }
  };

  // Зургийг сервер рүү илгээн анализуулах
  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setAnalyzing(true);
    setDetectedObjects([]);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);

      const response = await fetch("/api/object-detection", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: { objects?: DetectedIngredient[] } = await response.json();
        setDetectedObjects(data.objects || []);
      } else {
        console.error("Failed to analyze image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-family flex gap-2 items-center">
        <span>
          <BsStars />
        </span>
        Ingredient recognition
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 block mb-2 text-sm font-medium">
            Upload a food photo, and AI will detect the ingredients.
          </label>
          {/* Зураг оруулдаг input болгон засав */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            onClick={analyzeImage}
            disabled={analyzing || !uploadedImage}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {analyzing ? "Analyzing..." : "Generate"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="flex gap-2 items-center font-family/sans">
          <span>
            <HiOutlinePhotograph />
          </span>
          Identified Ingredients
        </h2>

        {!uploadedImageUrl && (
          <p className="text-gray-400 text-sm mt-1">
            First, upload an image to recognize ingredients.
          </p>
        )}

        {/* Зураг сонгосон үед зургийг харуулна */}
        {uploadedImageUrl && (
          <div className="border rounded-lg p-4 mt-4">
            <img
              src={uploadedImageUrl}
              alt="Uploaded Food"
              className="w-full max-h-[300px] object-cover rounded-lg mb-4"
            />

            {/* AI-аас ирсэн орцуудын жагсаалтыг харуулна */}
            {detectedObjects.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-lg">Detected Ingredients:</h3>
                <ul className="space-y-1">
                  {detectedObjects.map((obj, index) => (
                    <li
                      key={index}
                      className="text-sm flex justify-between border-b py-1"
                    >
                      <span className="font-medium">{obj.label}</span>
                      {obj.score !== undefined && (
                        <span className="text-gray-500">
                          {(obj.score * 100).toFixed(1)}%
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              !analyzing && (
                <p className="text-sm text-gray-500">
                  Click "Generate" to analyze the image.
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
