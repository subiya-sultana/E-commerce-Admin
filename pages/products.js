/* eslint-disable @next/next/no-img-element */
// Product page... for adding, editing, deleting and displaying products
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true)

    // fetching products from api
    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data)
            // console.log(response.data)
            setLoading(false)
        }).catch(err => {
            console.log("Error fetching products: ", err)
            setLoading(false)
        })
    }, [])

    return <Layout>

        <div className="flex justify-between">
            <h1>Products</h1>

            <Link href={'/products/new-product'} className="bg-green-700 text-white rounded-md p-2 px-4 flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p> Add new product</p>
            </Link>
        </div>

        <table className="basic">
            <thead>
                <tr>
                    <td className="text-center"><p className="hidden sm:block">Product</p></td>
                    <td>Product Detail</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="3" className="text-center py-4">
                            <Spinner />
                        </td>
                    </tr>
                ) : products && products.length > 0 ? (
                    products.map((product) => (
                        <tr key={product._id}>
                            <td className="text-center">
                                <img
                                    src={product.images[0]}
                                    alt="Product"
                                    className="h-20 w-28 rounded-lg object-cover mx-auto hidden sm:block"
                                />
                            </td>
                            <td>
                                Title: {product.title} <br /> Price: ₹{product.price}
                            </td>
                            <td>
                                <Link href={`/products/edit/${product._id}`} className="link">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>
                                    Edit
                                </Link>
                                <Link href={`/products/delete/${product._id}`} className="link">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-4">
                            No products available to display. Click on <q>Add new product</q> to create one!
                        </td>
                    </tr>
                )}
            </tbody>
        </table>


    </Layout>
}