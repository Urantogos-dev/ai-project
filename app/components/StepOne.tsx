"use client";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";

type DetectedObject = {
  label: string;
  score?: number;
};
export const StepOne = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [analyzing, setAnalyzing] = useState(false);


  //zurag bairshuulah
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);//browser deer haragduulah url uusgene
      setUploadedImageUrl(url);
      setDetectedObjects([]);
    }
  };
//zurgaa ai ruu ilgeeh analiz hiih 
//1.form data ashiglah API ruu ilgeeh 
//2.
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
        const data = await response.json();
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
      <h2 className="text-2xl font-family flex ">
        <span>
          <BsStars />
        </span>
        Image analysis{" "}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 block mb-2 text-sm font-medium">
            Describe the food, and AI will detect the ingredients.
          </label>

          <input
            type="file"
            accept="image/*"
            placeholder="Орц тодорхойлох"
            onChange={handleImageUpload}
            className={`w-full h-[124px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  className="w-full rounded-lg mb-4"
                />
              )
            }`}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={analyzeImage}
            disabled={analyzing || !uploadedImage}
            className=" px-6 py-2  bg-gray-900 text-white rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed transitionn"
          >
            {analyzing ? "Analyzing..." : "Genrate"}
          </button>
        </div>
      </div>
      <div>
        <h2 className="flex gap-2 items-center font-family/sans">
          <span>
            <HiOutlinePhotograph />
          </span>
          Result
        </h2>
        <p className="text-gray-400">
          First, enter your text to generate an image.
        </p>
        {uploadedImageUrl && (
          <div className="border rounded-lg p-4">
            {/* <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="w-full rounded-lg mb-4"
            /> */}

            {detectedObjects.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-lg">Detected Objects:</h3>
                <ul className="space-y-1">
                  {detectedObjects.map((obj, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{obj.label}</span>
                      {obj.score && (
                        <span className="text-gray-600 ml-2">
                          ({(obj.score * 100).toFixed(1)}%)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
