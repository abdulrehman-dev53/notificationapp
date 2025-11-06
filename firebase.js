import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized successfully!");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

export default admin;
