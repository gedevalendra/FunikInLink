// /app/api/profile/customize/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Sesuaikan path authOptions Anda
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { background, isBlur, rounded, profileBorder, linkStyle, showPopup, popupMessage } = body;

    await connectDB();

    // Update field customization di dalam dokumen User
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          customization: {
            background,
            isBlur,
            rounded,
            profileBorder,
            linkStyle,
            showPopup,
            popupMessage
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser.customization });
  } catch (error) {
    console.error("Error saving customization:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}