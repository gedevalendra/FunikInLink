import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Format unik, misal: FUNIKIN-17182938
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    planType: { type: String, enum: ["premium", "deluxe"], required: true },
    status: { type: String, enum: ["pending", "settlement", "expire", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);