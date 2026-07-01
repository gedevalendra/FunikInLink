import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { SharedLink } from "../../../../lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { links } = await req.json();
    await connectDB();

    // Lakukan pembaruan nomor urutan link secara massal di DB
    const promises = links.map((item: { id: string; order: number }) =>
      SharedLink.updateOne({ _id: item.id }, { $set: { order: item.order } })
    );
    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}