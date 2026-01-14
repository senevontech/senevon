import ContactMessage from "../models/ContactMessage.js";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email || "").trim());

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body || {};

    if (!name?.trim()) return res.status(400).json({ success: false, message: "Name is required." });
    if (!email?.trim() || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }
    if (!message?.trim()) return res.status(400).json({ success: false, message: "Message is required." });

    const doc = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      message: message.trim(),
      source: (source || "").trim(),
      ip: req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip,
      userAgent: req.headers["user-agent"]?.toString().slice(0, 256) || "",
    });

    return res.status(201).json({
      success: true,
      message: "Thanks! We received your message.",
      id: doc._id,
    });
  } catch (err) {
    console.error("submitContact error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
