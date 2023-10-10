'use client'
import { signOut, useSession } from "next-auth/react";
import Remote from "./remote";
import Link from "next/link";

export default function Home() {
  const session: any = useSession()
  console.log(session)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        { session && ( 
          <div>
          <img src={session?.data?.user?.user?.image}></img> 
          { session.status === 'authenticated' && <Remote session={session}/>}
          </div>
        )}
      </div>
      { session?.status === "authenticated" ? <button onClick={() => signOut()}>logout</button> : <Link href='/login'>Login</Link>}
    </main>
  );
}
