import { useSession, signIn, signOut } from "next-auth/react"
import SideNav from "@/components/sideNav";

export default function Layout({children}) {
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
    <div className="bg-green-900 w-screen min-h-screen flex">
      <SideNav />
      <div className="bg-green-100 flex-grow m-2 ml-0 p-3 rounded-lg ">{children}</div>
    </div>
  );
}
