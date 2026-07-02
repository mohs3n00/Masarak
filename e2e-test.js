
require("dotenv").config({ path: "./.env.local" });
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const axios = require("axios");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const email = "e2etest_" + Date.now() + "@example.com";
const password = "Password123!";

async function runTest() {
  try {
    console.log("1. Testing Registration...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Firebase user created:", userCredential.user.uid);

    console.log("\n2. Getting ID Token...");
    const token = await userCredential.user.getIdToken(true);
    console.log("Token retrieved.");

    console.log("\n3. Testing Backend Sync...");
    const syncRes = await axios.post("http://localhost:4000/api/auth/firebase/sync", { token });
    console.log("Backend response status:", syncRes.status);
    console.log("Backend response user:", syncRes.data.user.id);
    
    console.log("\n4. Testing Logout...");
    await signOut(auth);
    console.log("Logged out from Firebase.");

    console.log("\n5. Testing Login...");
    const loginCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in again:", loginCredential.user.uid);
    const newToken = await loginCredential.user.getIdToken(true);
    
    console.log("\n6. Testing Backend Sync (Login)...");
    const syncRes2 = await axios.post("http://localhost:4000/api/auth/firebase/sync", { token: newToken });
    console.log("Backend response user:", syncRes2.data.user.id);

    console.log("\n? All Tests Passed!");
    process.exit(0);
  } catch(e) {
    console.error("? Test Failed:");
    if (e.response) {
      console.error(e.response.data);
    } else {
      console.error(e.message);
    }
    process.exit(1);
  }
}
runTest();

