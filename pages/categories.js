// Category page here
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {

    const [categoryName, setCategoryName] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [loading, setLoading] = useState(true)


    // function to save the categories page
    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories', {categoryName, parentCategory});
        setCategoryName('');
        fetchCategories();
    }

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

    return <Layout>
        <h1>Categories</h1>
        <label>New Category Name</label>
        <form onSubmit={saveCategory} className="flex gap-1">
            <input 
                type="text"
                placeholder="Category Name"
                className="mb-0"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
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
                                </tr>
                            ))
                        : "No Categories to display"
                }
            </tbody>
        </table>
    </Layout>

}