import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Link } from "@/models/Link";

// 1. GET: Mengambil semua link milik user tertentu
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId dibutuhkan" }, { status: 400 });
    }

    const links = await Link.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(links, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Menambah link baru ke database
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, icon, title, description, url } = body;

    if (!userId || !icon || !title || !url) {
      return NextResponse.json({ error: "Data kurang lengkap" }, { status: 400 });
    }

    const newLink = await Link.create({ userId, icon, title, description, url });
    return NextResponse.json(newLink, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT: Mengedit/Update link yang sudah ada
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { linkId, icon, title, description, url } = body;

    if (!linkId) {
      return NextResponse.json({ error: "linkId dibutuhkan" }, { status: 400 });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      linkId,
      { icon, title, description, url },
      { new: true } // Mengembalikan data yang terbaru setelah diedit
    );

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Menghapus link dari database
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("linkId");

    if (!linkId) {
      return NextResponse.json({ error: "linkId dibutuhkan" }, { status: 400 });
    }

    await Link.findByIdAndDelete(linkId);
    return NextResponse.json({ message: "Link berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}