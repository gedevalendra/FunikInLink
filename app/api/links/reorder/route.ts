import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { SharedLink } from "../../../../lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Validasi session untuk memastikan yang mengubah adalah admin pemilik akun
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { links } = await req.json();
    
    if (!links || !Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await connectDB();

    // 2. Gunakan bulkWrite atau Promise.all untuk mengupdate field 'order' secara massal.
    // Operator $set otomatis membuat field baru jika sebelumnya tidak ada (pada data lama).
    const promises = links.map((item: { id: string; order: number }) =>
      SharedLink.updateOne(
        { _id: item.id }, 
        { $set: { order: item.order } }
      )
    );
    
    await Promise.all(promises);

    return NextResponse.json({ success: true, message: "Urutan tautan berhasil disimpan otomatis." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}