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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Notification API is running successfully!" });
});

// ✅ Send notification route
app.post("/send", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ error: "token, title, and body are required" });
    }

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
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ For local dev (not used in Vercel)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app; // ✅ Important for Vercel
