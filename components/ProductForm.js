import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductForm({
        _id,
        title: existingTitle,
        description: existingDescription,
        price : existingPrice
    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProductsPage, setGoToProductsPage] = useState(false)
    const router = useRouter();
    console.log("product form data here.... ", existingTitle, existingDescription, existingPrice, _id)

    async function AddProduct(e) {
        e.preventDefault();
        const data = {title, description, price}
        if(_id){
            // update product
            await axios.put('/api/products', {...data, _id})
        }else{
            // create product
            await axios.post('/api/products', {...data})
            console.log("new product added")
        }
        setGoToProductsPage(true)
    }
    if(goToProductsPage == true){
        return router.push('/products');
    }

    return(
        <form onSubmit={AddProduct}>
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
    )
}