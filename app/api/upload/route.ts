import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unautharized ❌" }, { status: 401 });
    }
    const { audioUrl, fileName, duration } = await req.json();

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio url is required" },
        { status: 400 },
      );
    }
    const recording = await prisma.entry.create({
      data: {
        userId: userId,
        audioUrl: audioUrl,
      },
    });

    return NextResponse.json({ success: true, recording });
  } catch (error) {
    console.error("Failed to save recording:", error);
    return NextResponse.json(
      { error: "Failed to save recording" },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch entries

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authorised❌" },
        { status: 401 },
      );
    }

    const entries = await prisma.entry.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.log("Failed to fetch❌", error);
    return NextResponse.json(
      { error: "Failed to fetch entries❌" },
      { status: 500 },
    );
  }
}
