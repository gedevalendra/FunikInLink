import mongoose from "mongoose";

const AdminListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nama: {
      type: String,
      required: true,
    },
    iduser: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdminList = mongoose.models.AdminList || mongoose.model("AdminList", AdminListSchema);

export default AdminList;