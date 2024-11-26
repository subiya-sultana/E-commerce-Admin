import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProductsPage, setGoToProductsPage] = useState(false)
    const router = useRouter();

    async function AddProduct(e) {
        const data = {title, description, price}
        e.preventDefault();
        await axios.post('/api/products', data )
        setGoToProductsPage(true)
        console.log("new product added")
    }
    if(goToProductsPage == true){
        return router.push('/products');
    }

    return(
        <Layout>
            <form onSubmit={AddProduct}>
                <h1>New Product</h1>
                <label>Product Name</label>
                <input 
                    type="text" 
                    placeholder="Product Name" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <label>Description</label>
                <textarea 
                    placeholder="Product Description"
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    required
                ></textarea>
                <label>Price ( in Rupees )</label>
                <input 
                    type="number"
                    placeholder="Price"
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    required
                />
                <button type="submit" className="btn-primary">Save</button>
                
                <p>{title} and {description} and {price}</p>

            </form>
        </Layout>
    )
}