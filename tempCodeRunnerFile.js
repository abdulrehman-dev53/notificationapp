import express from "express";
const app = express();

app.post("/send", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    // ✅ Validate input
    if (!token || !title || !body) {
      return res.status(400).json({ error: "token, title, and body are required" });
    }

    // ✅ Build FCM message
    const message = {
      token,
      notification: { title, body },
      android: { priority: "high" },
    };

    // ✅ Send message using Firebase Admin
    const response = await admin.messaging().send(message);

    res.json({
      success: true,
      message: "Notification sent successfully!",
      response,
    });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});
