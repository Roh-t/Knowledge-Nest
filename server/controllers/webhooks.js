import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    wh.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    });

    const { data, type } = req.body;

    console.log("📨 Clerk Webhook Type:", type);

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
          enrolledCourses: [],
        };
        const createdUser = await User.create(userData);
        console.log("✅ User created:", createdUser);
        return res.status(200).json({ success: true });
      }

      case 'user.updated': {
        const updatedData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, updatedData);
        console.log("🔄 User updated:", data.id);
        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        return res.status(200).json({ success: true });
      }

      default:
        console.warn("⚠️ Unhandled webhook type:", type);
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
