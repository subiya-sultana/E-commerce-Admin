// Category page here
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {

    const [categoryName, setCategoryName] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [loading, setLoading] = useState(true)

    // function to fetch categories from db
    function fetchCategories(){
        axios.get('/api/categories')
            .then( result => { 
                setAllCategories(result.data)
                setLoading(false)
            })
            .catch(err=> { 
                console.log("Error fetching categories: ", err);
                setLoading(false);
            } );
    }

    useEffect(()=>{
        fetchCategories();
    }, []);

    // function to save the categories page
    async function saveCategory(e) {
        e.preventDefault();
        if(editedCategory){
            await axios.put('/api/categories', { categoryName, parentCategory, _id : editedCategory._id});
            setEditedCategory(null);
        }
        else{
            await axios.post('/api/categories', {categoryName, parentCategory});
        }
        setCategoryName('');
        fetchCategories();
    }

    // function to edit existing category
    function editCategory(category) {
        setEditedCategory(category)
        setCategoryName(category.name)
        setParentCategory(category?.parent?._id || "")
    } 

    // function to delete category
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete this category -- ${category.name}`,
            showCancelButton: true,
            confirmButtonText : 'Yes, Delete!',
            confirmButtonColor: '#14532D',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories();
            }
        })
    }

    return <Layout>
        <h1>Categories</h1>
        <label className="p-1 pl-1 inline-block font-semibold">
            {
                editedCategory 
                ? `Edit Category -- ${editedCategory.name}`
                : "New Category Name"
            }
        </label>
        <form onSubmit={saveCategory} className="flex gap-1">
            <input 
                type="text"
                placeholder="Category Name"
                className="mb-0"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                required
            />
            <select 
                className="mb-0"
                value={parentCategory}
                onChange={e => setParentCategory(e.target.value)}
            >
                <option value="">No parent category</option>
                {
                    allCategories ?
                        allCategories.map(category => (
                            <option key={category._id} value={category._id}> {category.name} </option>
                        ))
                    : "No Categories to display"
                }
            </select>
            <button type="submit" className="btn-primary py-1 ">Save</button>
        </form>
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td>Category Name</td>
                    <td>Parent Category</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {
                    loading?
                        "loading Categories...." 
                        : allCategories ?
                            allCategories.map(category => (
                                <tr key={category._id} >
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td className="">
                                        <button 
                                            className="btn-primary mr-1"
                                            onClick={()=> editCategory(category)}
                                        >
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg> */}
                                            Edit
                                        </button>
                                        <button 
                                            className="btn-primary inline-block"
                                            onClick={() => deleteCategory(category)}
                                        >
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg> */}
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        : "No Categories to display"
                }
            </tbody>
        </table>
    </Layout>
}

export default withSwal(({swal},ref) => (
    <Categories swal={swal}/>
));

