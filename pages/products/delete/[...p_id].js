// /products/.p_id page.... for deleting existing product
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductsPage(){

    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter()
    const {p_id} = router.query;

    // fetching product which we want to delete
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

    function goBack(){
        router.push('/products')
    }

    // function to delete product from database
    async function deleteProduct(){
        await axios.delete('/api/products?p_id='+p_id)
        goBack();
    }

    return(
        <Layout>
            <div>
                <h1 className="text-center mt-4">Do you really want to delete &quot;{productInfo?.title}&quot; ?</h1>
                <div className="flex gap-2 justify-center">
                    <button className="btn-primary" onClick={deleteProduct}>Yes!</button>
                    <button className="btn-default" onClick={goBack}>No!</button>
                </div>
            </div>
        </Layout>
    )
}