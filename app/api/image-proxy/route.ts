import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { message: "Image key is required" },
        { status: 400 },
      );
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://192.168.1.35:8000/v1";

    const imageUrl =
      `${apiBase.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;

    console.log("PROXY IMAGE URL:", imageUrl);

    const response = await fetch(imageUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: `Unable to load image "${key}". Backend returned ${response.status}.`,
        },
        { status: response.status },
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("IMAGE PROXY ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load image",
      },
      { status: 500 },
    );
  }
}