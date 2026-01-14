import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    source: { type: String, trim: true, maxlength: 120 }, // optional: page name
    ip: { type: String, trim: true, maxlength: 64 },      // optional
    userAgent: { type: String, trim: true, maxlength: 256 } // optional
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
