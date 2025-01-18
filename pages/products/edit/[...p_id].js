// /products/.p_id page.... for editing existing product
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductsPage(){

    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter();
    const {p_id} = router.query;

    // use effect to fetch data of the product we want to edit so that we can update form
    useEffect(()=>{
        if(!p_id){
            return;
        }
        axios.get('/api/products?p_id='+p_id)
        .then((response)=>{
            setProductInfo(response.data)
            // console.log(response.data)
        })
        .catch((err)=>{
            console.log("Some error occured: ", err.message)
        })
    },[p_id])
    
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