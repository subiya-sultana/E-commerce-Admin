// INDEX.JS page.. starting point of project...also contains dashboard here
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-green-900 flex justify-between">
        <h2>hello, <b>{session?.user?.name}</b></h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="User Image" className="w-8 h-8"/>
          <span className="py-1 px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
      <h1>Dashboard here.... why i am soooo stupiidddddd???? likeeeee whyyyyyyyyyy</h1>
    </Layout>
  )
}