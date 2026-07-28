import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const POST = async (req: Request) => {
  const body = await req.json();
  const { prompt } = body;
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(prompt, "prompt");
  return Response.json(result.text);
};
