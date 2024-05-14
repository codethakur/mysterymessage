'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div className="flex justify-center items-center h-screen">
      Not signed in <br />
      <button className="bg-teal-300 px-3 py-2 m-5 rounded-md text-black font-bold transition duration-300 shadow-sm hover:shadow-md" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}