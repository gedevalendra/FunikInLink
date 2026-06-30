import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { planType } = await request.json();
    let price = 0;

    if (planType === "premium") price = 25000;
    else if (planType === "deluxe") price = 50000;
    else return NextResponse.json({ message: "Plan tidak valid" }, { status: 400 });

    await connectDB();

    const orderId = `FUNIKIN-${Date.now()}`;

    // 1. Simpan data transaksi pending ke database
    await Order.create({
      orderId,
      userId: (session.user as any).id,
      userEmail: session.user.email,
      amount: price,
      planType,
      status: "pending",
    });

    // 2. Hubungi Midtrans API Snap untuk mendapatkan payment token
    const authString = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64");
    
    const midtransResponse = await fetch(`${process.env.MIDTRANS_SNAP_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: price,
        },
        item_details: [
          {
            id: planType,
            price: price,
            quantity: 1,
            name: `Langganan Funikin ${planType.toUpperCase()} (1 Tahun)`,
          },
        ],
        customer_details: {
          first_name: session.user.name,
          email: session.user.email,
        },
        enabled_payments: ["qris", "gopay", "shopeepay"], // Batasi hanya QRIS / E-wallet gratisan
      }),
    });

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      throw new Error(midtransData.error_messages?.[0] || "Gagal menghubungi Midtrans");
    }

    // Mengembalikan token transaksi ke frontend
    return NextResponse.json({ token: midtransData.token, orderId });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}