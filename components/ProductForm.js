// Product form component to deal with adding new products and editing products (most important component so don't edit without thinking)
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    category: existingCategory,
    properties: existingProperties,
    images: existingImages,
    description: existingDescription,
    price: existingPrice,
}) {

    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(existingCategory || '')
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const [images, setImages] = useState(existingImages || []);
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');

    const [allCategories, setAllCategories] = useState([]);
    const [goToProductsPage, setGoToProductsPage] = useState(false)
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // console.log("product form data here.... ", existingTitle, existingDescription, existingPrice, _id)

    // fetching all the categories so that we can display them in form
    useEffect(() => {
        axios.get('/api/categories')
            .then(result => {
                setAllCategories(result.data);
            })
            .catch(err => {
                console.error('Failed to fetch categories:', err);
            });
    }, []);

    // Function to save product in the database (i.e adding or updating product in database)
    async function AddProduct(e) {
        
        e.preventDefault();
        const data = {
            title,
            category,
            description,
            images,
            price,
            properties: productProperties,
        }
        if (_id) {
            // update product
            await axios.put('/api/products', { ...data, _id })
            console.log("product updated successfully")
            setGoToProductsPage(true)
        } else {
            // create product
            await axios.post('/api/products', { ...data })
            console.log("new product added successfully")
            setGoToProductsPage(true)
        }
    }

    // sending user to products page..after product added
    useEffect(() => {
        if (goToProductsPage) {
            router.push('/products');
        }
    }, [goToProductsPage, router]);

    // Function to handle image upload
    async function uploadImages(ev) {
        const files = ev.target.files;
        if (!files?.length) return;

        setIsUploading(true);
        const formData = new FormData();

        // Append all selected files
        for (const file of files) {
            formData.append('file', file);
        }

        try {
            const res = await axios.post('/api/uploadFile', formData);
            
            // Ensure response contains a valid URL or array of URLs
            const imageUrls = Array.isArray(res.data.url) ? res.data.url : [res.data.url];

            setImages((prevImages) => [...prevImages, ...imageUrls]);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
        }
    }

    // function to drag and drop images to rearrange thier order
    function updateImagesOrder(images) {
        setImages(images);
    }

    // function to set properties of the product
    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    // ineriting parent product properties to child product properties 
    const propertiesToFill = [];
    if (allCategories.length > 0 && category) {
        let catInfo = allCategories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = allCategories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <form onSubmit={AddProduct} className="productForm">
            {/* Handling product Name */}
            <label>Product Name</label>
            <input
                type="text"
                placeholder="Product Name"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            {/* Handling product Category*/}
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

            {/* Handling product Properties*/}
            {
                propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div key={p.name} className="">
                        <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                        <div>
                            <select value={productProperties[p.name]}
                                onChange={ev =>
                                    setProductProp(p.name, ev.target.value)
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

            {/* Handling product Images*/}
            <label>Product Images</label>
            {
                !images?.length && (<div className="text-sm text-gray-500 mb-1 pl-2">No photos available to preview this product.</div>)
            }
            <div className="mb-2 flex flex-wrap gap-2">
                
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1 max-w-full overflow-hidden "
                    setList={updateImagesOrder}>
                    {
                        !!images?.length &&
                        images.map((link, index) => (
                            <div
                                key={link + index}
                                className="h-24 w-32 bg-white p-1 shadow-sm rounded-md border border-gray-200 cursor-grab overflow-hidden"
                            >
                                <img
                                src={link}
                                alt="product-img"
                                className="rounded-lg object-cover w-full h-full"
                                />
                            </div>
                        ))
                    }
                </ReactSortable>

                {
                    isUploading && (
                        <div className="h-24 flex items-center">
                            <Spinner />
                        </div>
                    )
                }
                <label className="cursor-pointer w-24 h-24 bg-green-300 text-green-900 text-center flex flex-col items-center justify-center rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload Photos</div>
                    <input type="file" className="hidden" onChange={uploadImages} />
                </label>
                
            </div>

            {/* Handling product Description*/}
            <label>Description</label>
            <textarea
                placeholder="Product Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                maxLength={1000}
                className="resize-none h-20"
            ></textarea>

            {/* Handling product Price*/}
            <label>Price ( in Rupees )</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
            />

            {/* Saving product in database */}
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}