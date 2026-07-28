import { InferenceClient } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new InferenceClient(HF_TOKEN);
interface DetectionResult {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No name Provider" }, { status: 400 });
    }

    const results = (await inference.objectDetection({
      model: "facebook/detr-resnet-50",
      data: image,
    })) as DetectionResult[];

    const objects = results
      .filter((obj) => obj.score > 0.5)
      .map((obj) => ({
        label: obj.label,
        score: obj.score,
        box: obj.box,
      }));
    return NextResponse.json({ objects });
  } catch (error) {
    console.error("error in object detection:", error);
    return NextResponse.json(
      { error: "Internal server error " },
      { status: 500 },
    );
  }
};
