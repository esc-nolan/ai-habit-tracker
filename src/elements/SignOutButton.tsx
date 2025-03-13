import { getAuth, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.push("/auth"); // ✅ Navigate to /auth after sign out
      })
      .catch((error) => console.error("Sign out error", error));
  };

  return (
    <Button onClick={handleSignOut} className="bg-black-500 hover:bg-zinc-600 text-white cursor-pointer">
      Sign Out
    </Button>
  );
}
