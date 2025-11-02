import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

try {
  if (!admin.apps.length) {
    console.log("🔹 Initializing Firebase...");

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Fix the private key line breaks
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase initialized successfully!");
  } else {
    console.log("ℹ️ Firebase already initialized.");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

export default admin;
