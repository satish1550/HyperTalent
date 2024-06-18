"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  const handleSignIn = () => {
    signIn("google", { callbackUrl: `${window.location.origin}/` });
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
}
