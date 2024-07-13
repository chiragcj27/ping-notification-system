'use client'
import { useSession, signIn, signOut } from "next-auth/react"

const Component: React.FC = () => {
  const { data: session } = useSession()

  console.log(session?.user);
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default Component