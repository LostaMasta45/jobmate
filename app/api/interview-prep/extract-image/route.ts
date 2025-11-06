import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, type } = body;

    if (!imageBase64 || !type) {
      return NextResponse.json(
        { error: "Missing imageBase64 or type" },
        { status: 400 }
      );
    }

    if (type !== 'cv' && type !== 'job_poster') {
      return NextResponse.json(
        { error: "Type must be 'cv' or 'job_poster'" },
        { status: 400 }
      );
    }

    console.log(`[Extract Image] Processing ${type} image...`);

    const extractedText = await extractTextFromImage(imageBase64, type);

    console.log(`[Extract Image] Success! Extracted ${extractedText.length} characters`);

    return NextResponse.json({
      success: true,
      extractedText,
    });

  } catch (error: any) {
    console.error("[Extract Image] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract text from image" },
      { status: 500 }
    );
  }
}
