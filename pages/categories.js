// Category page here
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {

    const [categoryName, setCategoryName] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true)


    // function to save the categories page
    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories', {categoryName});
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
            <button type="submit" className="btn-primary py-1 ">Save</button>
        </form>
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td>Category Name</td>
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
                                </tr>
                            ))
                        : "No Categories to display"
                }
            </tbody>
        </table>
    </Layout>

}