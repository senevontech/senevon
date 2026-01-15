// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// dotenv.config();

// const app = express();

// /* =========================
//    Core Middleware
// ========================= */
// app.use(helmet());
// app.use(express.json({ limit: "20kb" }));

// /**
//  * CORS
//  * - Local dev: http://localhost:5173
//  * - Prod: set FRONTEND_URL in .env (example: https://yourdomain.com)
//  */
// app.use(
//   cors({
//     origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
//     credentials: false,
//   })
// );

// /* =========================
//    Rate Limit (anti-spam)
// ========================= */
// const contactLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// /* =========================
//    Mongoose Model (inline)
// ========================= */
// const ContactMessageSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, maxlength: 80 },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       maxlength: 120,
//     },
//     phone: { type: String, trim: true, maxlength: 30 },
//     message: { type: String, required: true, trim: true, maxlength: 2000 },
//   },
//   { timestamps: true }
// );

// const ContactMessage =
//   mongoose.models.ContactMessage ||
//   mongoose.model("ContactMessage", ContactMessageSchema);

// /* =========================
//    Admin Auth (simple key)
// ========================= */
// function requireAdmin(req, res, next) {
//   const key = req.headers["x-admin-key"];
//   if (!key || key !== process.env.ADMIN_KEY) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }
//   next();
// }

// /* =========================
//    Routes
// ========================= */

// // Contact API (public)
// app.post("/api/contact", contactLimiter, async (req, res) => {
//   try {
//     const { name, email, phone, message } = req.body || {};

//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, Email and Message are required.",
//       });
//     }

//     const saved = await ContactMessage.create({
//       name,
//       email,
//       phone: phone || "",
//       message,
//     });

//     return res.json({
//       success: true,
//       message: "✅ Message received. We will contact you soon.",
//       id: saved._id,
//     });
//   } catch (err) {
//     console.error("CONTACT API ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// });

// // Admin: get all contact messages
// app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
//   try {
//     const list = await ContactMessage.find({})
//       .sort({ createdAt: -1 })
//       .limit(500);

//     return res.json({ success: true, data: list });
//   } catch (err) {
//     console.error("ADMIN CONTACTS ERROR:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Admin: delete one message
// app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await ContactMessage.findByIdAndDelete(id);
//     return res.json({ success: true, message: "Deleted" });
//   } catch (err) {
//     console.error("ADMIN DELETE ERROR:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// /* =========================
//    Health Check
// ========================= */
// app.get("/api/health", (req, res) => {
//   res.json({ ok: true, service: "snv-backend" });
// });

// /* =========================
//    Start Server + DB
// ========================= */
// const PORT = process.env.PORT || 5000;

// async function start() {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGO_URI is missing in backend/.env");
//     }
//     if (!process.env.ADMIN_KEY) {
//       throw new Error("ADMIN_KEY is missing in backend/.env");
//     }

//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`✅ Backend running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Server failed to start:", err.message);
//     process.exit(1);
//   }
// }

// start();




























































// backend/server.js
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
app.use(express.json({ limit: "50kb" })); // career can have more text

/**
 * ✅ CORS FIX (Render + Local)
 * - Allows x-admin-key header for admin dashboard
 * - Allows OPTIONS preflight
 */


// const allowedOrigins = [
//   "http://localhost:5173",
//   process.env.FRONTEND_URL, 
// ].filter(Boolean);

// const corsOptions = {
//   origin: (origin, cb) => {
    
//     if (!origin) return cb(null, true);
//     if (allowedOrigins.includes(origin)) return cb(null, true);
//     return cb(new Error(`CORS blocked for origin: ${origin}`));
//   },
//   credentials: false,
//   methods: ["GET", "POST", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "x-admin-key"],
// };

// app.use(cors(corsOptions));

// app.options(/.*/, cors(corsOptions));



const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // e.g. https://senevon-ftnl.onrender.com
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/curl
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false); // IMPORTANT: don't throw error (preflight will still respond)
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-key"],
  credentials: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ Express 5 safe



/* =========================
   Rate Limit (anti-spam)
========================= */
const publicLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================
   Mongoose Model (unified)
   type: contact | career
========================= */
const SubmissionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["contact", "career"], required: true },

    // common fields
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },

    // contact fields
    message: { type: String, trim: true, maxlength: 3000 },

    // career fields
    role: { type: String, trim: true, maxlength: 120 },
    portfolio: { type: String, trim: true, maxlength: 250 },
    linkedin: { type: String, trim: true, maxlength: 250 },
    resumeUrl: { type: String, trim: true, maxlength: 500 },
    coverLetter: { type: String, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

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
   Public Routes
========================= */

// ✅ Contact (public)
app.post("/api/contact", publicLimiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Message are required.",
      });
    }

    const saved = await Submission.create({
      type: "contact",
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

// ✅ Career Application (public)
app.post("/api/career/apply", publicLimiter, async (req, res) => {
  try {
    const { name, email, phone, role, portfolio, linkedin, resumeUrl, coverLetter } = req.body || {};

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Role are required.",
      });
    }

    const saved = await Submission.create({
      type: "career",
      name,
      email,
      phone: phone || "",
      role,
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      resumeUrl: resumeUrl || "",
      coverLetter: coverLetter || "",
    });

    return res.json({
      success: true,
      message: "✅ Application received. We will get back to you.",
      id: saved._id,
    });
  } catch (err) {
    console.error("CAREER API ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/* =========================
   Admin Routes
   - filter by type: contact|career|all
========================= */
app.get("/api/admin/submissions", requireAdmin, async (req, res) => {
  try {
    const type = String(req.query.type || "all").toLowerCase();
    const q =
      type === "contact" ? { type: "contact" } :
      type === "career" ? { type: "career" } :
      {};

    const list = await Submission.find(q).sort({ createdAt: -1 }).limit(1000);
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error("ADMIN SUBMISSIONS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/admin/submissions/:id", requireAdmin, async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



// contact 
// ✅ Backward compatibility (old frontend routes)
app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
  const list = await Submission.find({ type: "contact" }).sort({ createdAt: -1 }).limit(1000);
  res.json({ success: true, data: list });
});

app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
  await Submission.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
});





/* =========================
   Health
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
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
    if (!process.env.ADMIN_KEY) throw new Error("ADMIN_KEY missing in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => console.log(`✅ Backend running on :${PORT}`));
  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
}

start();
