"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
//   signInWithRedirect,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

        console.log("User Info:", user);
        console.log("User saved and logged in");
      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded-lg border border-gray-300 shadow hover:bg-gray-100 hover:text-black cursor-pointer transition"
    >
       {/* Google Logo */}
       <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google Logo"
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
}
