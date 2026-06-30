import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status_code, gross_amount, transaction_status, signature_key } = body;

    // 1. Validasi SHA512 Signature dari Midtrans demi keamanan data (Anti-Hacker)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hashed = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hashed !== signature_key) {
      return NextResponse.json({ message: "Invalid Signature Key" }, { status: 403 });
    }

    await connectDB();

    // 2. Cari data order di database kamu
    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
    }

    // 3. Proses berdasarkan status transaksi dari Midtrans
    if (transaction_status === "settlement" || transaction_status === "capture") {
      // Pembayaran Sukses!
      order.status = "settlement";
      await order.save();

      // Hitung masa aktif langganan (+1 Tahun dari sekarang)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // Upgrade status user ke Premium / Deluxe
      await User.findByIdAndUpdate(order.userId, {
        subscriptionStatus: order.planType,
        subscriptionExpiresAt: expiresAt,
      });

    } else if (transaction_status === "expire" || transaction_status === "cancel") {
      order.status = "expire";
      await order.save();
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}