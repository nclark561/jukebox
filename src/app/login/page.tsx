'use client'
import { signIn } from "next-auth/react";

export default function page() {

  return (
    <div>
      <button onClick={() => signIn("spotify", { callbackUrl: "/" })}>Login</button>
    </div>
  );
}
