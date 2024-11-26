import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    async function AddProduct(e) {
        const data = {title, description, price}

        e.preventDefault();
        await axios.post('/api/products', data )
        // console.log("product added")
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
                />
                <label>Description</label>
                <textarea 
                    placeholder="Product Description"
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <label>Price ( in Rupees )</label>
                <input 
                    type="number"
                    placeholder="Price"
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                />
                <button type="submit" className="btn-primary">Save</button>
                
                <p>{title} and {description} and {price}</p>

            </form>
        </Layout>
    )
}