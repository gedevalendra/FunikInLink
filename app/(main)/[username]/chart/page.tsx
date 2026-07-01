import { connectDB } from "../../../../lib/db";
import { Chart } from "../../../../lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import CartClientContainer from "./CartClientContainer";

interface Props {
  params: Promise<{ username: string }> | { username: string };
}

export default async function CartPage({ params }: Props) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/api/auth/signin"); 
  }

  const userId = (session.user as any).id;
  const resolvedParams = await params;
  const username = resolvedParams.username;

  // Ambil data keranjang asli dari database MongoDB milik user tersebut
  const dbCartItems = await Chart.find({ userId }).lean();

  const serializedCart = dbCartItems.map((item: any) => ({
    id: String(item._id),
    name: item.title,
    price: item.price,
    image: item.image,
    qty: item.qty
  }));

  return (
    <CartClientContainer 
      initialCart={serializedCart} 
      username={username} 
    />
  );
}