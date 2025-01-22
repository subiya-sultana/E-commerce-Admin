// Layout component... cosists of sideNav and main div
import { useSession, signIn, signOut } from "next-auth/react"
import SideNav from "@/components/sideNav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}) {

  const [showNav, setShowNav] = useState(false)

  // handling user login
  const { data: session } = useSession()
  if(!session) {
    return (
      <div className="bg-green-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button className="bg-white p-2 rounded-md" onClick={()=> signIn('google')}>
            Login With Google
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-green-900 w-screen min-h-screen">
      <div className="md:hidden flex items-center p-2">
        <button onClick={()=>setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <SideNav show={showNav} setShow={setShowNav}/>
        <div className="overflow-y-scroll overflow-x-hidden bg-green-200 flex-grow m-2 p-3 rounded-lg h-[96vh] myScrollbar">{children}</div>
      </div>
    </div>
  );
}
