import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "./firebase.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = admin.firestore();

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Notification API is running successfully!" });
});

// ✅ Get all registered users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Send Notification
app.post("/send", async (req, res) => {
  try {
    const { receiverId, title, body } = req.body;
    if (!receiverId || !title || !body)
      return res.status(400).json({ error: "receiverId, title, and body are required" });

    const userDoc = await db.collection("users").doc(receiverId).get();
    if (!userDoc.exists) return res.status(404).json({ error: "Receiver not found" });

    const token = userDoc.data().fcmToken;
    if (!token) return res.status(400).json({ error: "Receiver has no FCM token" });

    const message = {
      token,
      notification: { title, body },
      android: { priority: "high" },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);
    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
