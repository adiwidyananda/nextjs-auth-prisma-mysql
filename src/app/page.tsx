"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session && session.user ? (
        <button onClick={() => signOut()}>signout</button>
      ) : (
        <button onClick={() => signIn()}>signin</button>
      )}
    </div>
  );
}
