import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body; // raw buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers); // Svix will parse JSON itself
    const { data, type } = evt;

    console.log("📨 Clerk Webhook Type:", type);

    switch (type) {
      case "user.created":
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
          enrolledCourses: [],
        };
        await User.create(userData);
        return res.status(200).json({ success: true });

      case "user.updated":
        const updatedData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, updatedData);
        return res.status(200).json({ success: true });

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });

      default:
        console.warn("⚠️ Unhandled webhook type:", type);
        return res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
