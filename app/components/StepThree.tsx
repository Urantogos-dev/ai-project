"use client";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { HiOutlinePhotograph } from "react-icons/hi";

export const StepThree = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-family flex gap-2 items-center">
            <span>
              <BsStars />
            </span>
            Image analysis
          </h2>
        </div>

        <label className="text-gray-400 block text-sm">
          Upload a food photo, and AI will detect the ingredients.
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrompt(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && generateImage()
          }
          placeholder="Хоолны тайлбар"
          className="w-full h-[130px] pb-20 pl-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full flex justify-end">
          <Button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <Spinner />
                Generating...
              </div>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>
      <div>
        <h2 className="flex gap-2 items-center font-family/sans">
          <span>
            <HiOutlinePhotograph />
          </span>{" "}
          Result
        </h2>
        <p className="text-gray-400">
          First, enter your text to generate an image.
        </p>
        {imageUrl && (
          <div className="mt-8 border rounded-lg p-4">
            <img src={imageUrl} alt="Generated" className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};
