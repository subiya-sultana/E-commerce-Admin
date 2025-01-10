import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductForm({
        _id,
        title: existingTitle,
        description: existingDescription,
        price : existingPrice,
        images
    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProductsPage, setGoToProductsPage] = useState(false)
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    console.log("product form data here.... ", existingTitle, existingDescription, existingPrice, _id)

    useEffect(()=>{
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
            console.log("categoriess aree: ", result.data)
        })
    },[])

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

    // function to handle image upload
    async function uploadImages(e){
        console.log(e)
        const files = e.target?.files;
        if(files?.length > 0){
            const data = new FormData();
            for(const file of files){
                data.append("file",file)
            }
            const res = await axios.post('/api/uploadFile', data)
            console.log(res.data)
        }
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
            <label>Category</label>
            <select>
                <option value="">Uncategorized</option>
                {
                    categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))
                }
            </select>
            <label>Product Images</label>
            <div className="mb-2">
                <label className="cursor-pointer w-24 h-24 bg-gray-300 text-gray-500 text-center flex flex-col items-center justify-center rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImages}/>
                </label>
                {
                    !images?.length && (<div>No photos available to preview this product</div>)

                }
            </div>
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
        </form>
    )
}