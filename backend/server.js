import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

/* =========================
   Core Middleware
========================= */
app.use(helmet());
app.use(express.json({ limit: "20kb" }));

/**
 * CORS
 * - Local dev: http://localhost:5173
 * - Prod: set FRONTEND_URL in .env (example: https://yourdomain.com)
 */
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
    credentials: false,
  })
);

/* =========================
   Rate Limit (anti-spam)
========================= */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================
   Mongoose Model (inline)
========================= */
const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    phone: { type: String, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);

/* =========================
   Admin Auth (simple key)
========================= */
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

/* =========================
   Routes
========================= */

// Contact API (public)
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Message are required.",
      });
    }

    const saved = await ContactMessage.create({
      name,
      email,
      phone: phone || "",
      message,
    });

    return res.json({
      success: true,
      message: "✅ Message received. We will contact you soon.",
      id: saved._id,
    });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Admin: get all contact messages
app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
  try {
    const list = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(500);

    return res.json({ success: true, data: list });
  } catch (err) {
    console.error("ADMIN CONTACTS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: delete one message
app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndDelete(id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================
   Health Check
========================= */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "snv-backend" });
});

/* =========================
   Start Server + DB
========================= */
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }
    if (!process.env.ADMIN_KEY) {
      throw new Error("ADMIN_KEY is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
}

start();
