// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import admin from "./firebase.js";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Test route to confirm API is working
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 Notification API is running successfully!" });
// });

// // ✅ Send notification route
// app.post("/send", async (req, res) => {
//   try {
//     const { token, title, body } = req.body;

//     // Validate input
//     if (!token || !title || !body) {
//       return res.status(400).json({ error: "token, title, and body are required" });
//     }

//     // Build FCM message
//     const message = {
//       token,
//       notification: { title, body },
//       android: { priority: "high" },
//     };

//     // Send notification
//     const response = await admin.messaging().send(message);
//     console.log("✅ Notification sent successfully:", response);

//     res.json({ success: true, messageId: response });
//   } catch (error) {
//     console.error("❌ Error sending notification:", error);
//     res.status(500).json({
//       error: "Internal Server Error",
//       details: error.message, // helpful for debugging
//     });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "./firebase.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Save FCM token in Firestore
app.post("/save-token", async (req, res) => {
  try {
    const { uid, token } = req.body;
    if (!uid || !token) return res.status(400).json({ error: "uid and token required" });

    await admin.firestore().collection("users").doc(uid).set({ fcmToken: token }, { merge: true });
    res.json({ success: true, message: "Token saved successfully!" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Send chat message and push notification
app.post("/send-message", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "senderId, receiverId, and message are required" });
    }

    // 1️⃣ Save message to Firestore
    const msgRef = await admin.firestore().collection("messages").add({
      senderId,
      receiverId,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2️⃣ Get receiver token
    const userDoc = await admin.firestore().collection("users").doc(receiverId).get();
    const token = userDoc.exists ? userDoc.data().fcmToken : null;
    if (!token) return res.status(404).json({ error: "Receiver token not found" });

    // 3️⃣ Send push notification
    const fcmMessage = {
      token,
      notification: {
        title: "New Message 💬",
        body: message,
      },
      data: { senderId, receiverId },
    };

    await admin.messaging().send(fcmMessage);
    res.json({ success: true, id: msgRef.id });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

