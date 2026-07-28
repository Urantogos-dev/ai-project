import { NextRequest } from "next/server";
import { InferenceClient } from "@huggingface/inference";
const HF_TOKEN = process.env.HF_TOKEN;
const inference = new InferenceClient(HF_TOKEN);

export const POST = async (request: NextRequest) => {
  const data = await request.json();

  const blob = (await inference.textToImage({
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: data.prompt,
  })) as unknown as {
    arrayBuffer(): Promise<ArrayBuffer>;
  };

  // Convert blob to buffer
  const buffer = await blob.arrayBuffer();
  console.log(buffer);
  // Return the image as a response
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
