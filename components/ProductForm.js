import categories from "@/pages/categories";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductForm({
        _id,
        title: existingTitle,
        category: existingCategory,
        description: existingDescription,
        price : existingPrice,
        properties: existingProperties,
        images,
    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(existingCategory || '')
    const [description, setDescription] = useState(existingDescription || '');
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProductsPage, setGoToProductsPage] = useState(false)
    const [allCategories, setAllCategories] = useState([]);
    const router = useRouter();
    console.log("product form data here.... ", existingTitle, existingDescription, existingPrice, _id)

    useEffect(()=>{
        axios.get('/api/categories').then(result =>{
            setAllCategories(result.data);
            console.log("categoriess aree: ", result.data)
        })
    },[])

    async function AddProduct(e) {
        e.preventDefault();
        const data = {
            title,
            category,
            description,
            price, 
            properties: productProperties,
        }
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

    function setProductProp(propName,value) {
        setProductProperties(prev => {
          const newProductProps = {...prev};
          newProductProps[propName] = value;
          return newProductProps;
        });
      }

    const propertiesToFill = [];
    if (allCategories.length > 0 && category) {
      let catInfo = allCategories.find(({_id}) => _id === category);
      propertiesToFill.push(...catInfo.properties);
      while(catInfo?.parent?._id) {
        const parentCat = allCategories.find(({_id}) => _id === catInfo?.parent?._id);
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
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
            <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option value="">Uncategorized</option>
                {
                    allCategories.length > 0 && allCategories.map(c => {
                        return <option key={c._id} value={c._id}>{c.name}</option>
                    })
                }
            </select>
            {
                propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div key={p.name} className="">
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                        <div>
                            <select value={productProperties[p.name]}
                                    onChange={ev =>
                                        setProductProp(p.name,ev.target.value)
                                    }
                            >
                                {
                                    p.values.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
            ))}
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