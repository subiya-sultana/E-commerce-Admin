// INDEX.JS page.. starting point of project...also contains dashboard here
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-green-900 flex justify-between ">
        <h2>Hello, <b>{session?.user?.name}</b></h2>

        <div className="flex justify-center items-center bg-green-300 text-green-900 font-bold rounded-full overflow-hidden pr-3 border border-green-300 shadow-green-500 shadow">
          <img src={session?.user?.image} alt="User Image" className="w-10 h-10 rounded-full"/>
          <span className="py-1 px-2 text-center">
            {session?.user?.name}
          </span>
        </div>

      </div>
      <h1>Dashboard here.... why i am soooo stupiidddddd???? likeeeee whyyyyyyyyyy</h1>
    </Layout>
  )
}