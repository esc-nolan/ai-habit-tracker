// "use client";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "@/lib/firebase";

// export default function LoginPage() {
//   const login = async () => {
//     await signInWithPopup(auth, provider);
//   };

//   return (
//     <div className="h-screen flex items-center justify-center">
//       <button
//         onClick={login}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//       >
//         Sign in with Google
//       </button>
//     </div>
//   );
// }


import GoogleLoginButton from "@/elements/GoogleLoginButton";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="p-8 bg-white dark:bg-black shadow-lg rounded-lg border-2 border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        <h1 className="text-xl font-semibold mb-4 text-center">Login to Your Account</h1>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
