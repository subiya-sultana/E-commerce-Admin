import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products() {
    return <Layout>
        <Link href={'/products/new-product'} className="bg-green-700 text-white rounded-md p-2">Add new product</Link>
        <p>pProducts page hereeee..... i am so mad right nowww.... and irritateddddddd.... at this point i feel like i deserve all bad happening to meeeeeeee</p>
    </Layout>
}