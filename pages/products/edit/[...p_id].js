import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductsPage(){
    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter();
    const {p_id} = router.query;
    useEffect(()=>{
        if(!p_id){
            return;
        }
        axios.get('/api/products?p_id='+p_id)
        .then((response)=>{
            setProductInfo(response.data)
            console.log(response.data)
        })
    },[p_id])
    console.log()
    return (
        <Layout>
            <h1>Edit Product</h1>
            {
                productInfo && (
                    <ProductForm {...productInfo}/>
                )
            }
        </Layout>
    )
}