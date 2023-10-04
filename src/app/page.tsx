'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const session: any = useSession()
  console.log(session)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        { session && <img src={session?.data?.user?.image}></img>}
      </div>
      { session?.status === "authenticated" ? <button onClick={() => signOut()}>logout</button> : <Link href='/login'>Login</Link>}
    </main>
  );
}
