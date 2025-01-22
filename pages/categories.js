// Category page here... for creating, editing, deleting and displaying categories 
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {

   const [categoryName, setCategoryName] = useState('');
   const [allCategories, setAllCategories] = useState([]);
   const [parentCategory, setParentCategory] = useState('');
   const [editedCategory, setEditedCategory] = useState(null);
   const [properties, setProperties] = useState([]);
   const [loading, setLoading] = useState(true)

   // function to fetch categories from database
   function fetchCategories() {
      axios.get('/api/categories')
         .then(result => {
            setAllCategories(result.data)
            setLoading(false)
         })
         .catch(err => {
            console.log("Error fetching categories: ", err);
            setLoading(false);
         });
   }

   // fetching categories when page loads
   useEffect(() => {
      fetchCategories();
   }, []);

   // function to add or edit category in database
   async function saveCategory(e) {
      e.preventDefault();
      const data = {
         categoryName,
         parentCategory,
         properties: properties.map(p => ({
            name:p.name,
            values:p.values.split(',')
         }))
      }
      if (editedCategory) {
         data._id = editedCategory._id;
         // api req to edit exisiting category
         await axios.put('/api/categories', data);
         setEditedCategory(null);
      }
      else {
         // api req to create new category
         await axios.post('/api/categories', data);
      }
      setCategoryName('');
      setParentCategory('');
      setProperties([]);
      fetchCategories();
   }

   // function to edit existing category form
   function editCategory(category) {
      setEditedCategory(category)
      setCategoryName(category.name)
      setParentCategory(category?.parent?._id || "")
      setProperties(
         category.properties.map(({name,values})=>({
            name,
            values: values.join(',')
         }))
      );  
   }

   // function to delete category
   function deleteCategory(category) {
      swal.fire({
         title: 'Are you sure?',
         text: `Do you want to delete this category -- ${category.name}`,
         showCancelButton: true,
         confirmButtonText: 'Yes, Delete!',
         confirmButtonColor: '#14532D',
         reverseButtons: true,
      }).then(async result => {
         if (result.isConfirmed) {
            const { _id } = category;
            await axios.delete('/api/categories?_id=' + _id)
            fetchCategories();
         }
      })
   }

   //function to add new property 
   function addProperty() {
      setProperties(prev => {
         return [...prev, { name: '', values: '' }];
      });
   }

   function handlePropertyNameChange(index, property, newName) {
      setProperties(prev => {
         const properties = [...prev];
         properties[index].name = newName;
         return properties;
      });
   }

   function handlePropertyValuesChange(index, property, newValues) {
      setProperties(prev => {
         const properties = [...prev];
         properties[index].values = newValues;
         return properties;
      });
   }

   // function to delete property
   function removeProperty(indexToRemove) {
      setProperties(prev => {
         return [...prev].filter((p, pIndex) => {
            return pIndex !== indexToRemove;
         });
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

      <form onSubmit={saveCategory}>

         <div className="gap-1 flex-row">

            <label>Category Name</label>
            <input
               type="text"
               placeholder="Category Name"
               value={categoryName}
               onChange={e => setCategoryName(e.target.value)}
               className=""
               required
            />

            <label>Category Parent</label>
            <select
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

         </div>

         <div className="mb-2">
            <label className="p-1 pl-1 inline-block font-semibold pr-4">Properties of new category</label>
            <button type="button" className="btn-default text-sm mb-2" onClick={addProperty}>Add new property</button>
            {
               properties.length > 0 ? (
                  <div className="flex mr-7 text-gray-700">
                     <p className="w-1/2 ">Property Name</p>
                     <p className="w-1/2 ">Property Values (comma separated)</p>
                  </div>
               )
               : <p className="text-sm text-gray-500">No properties defined for the product (click on <q>add new properties</q> to create properties).</p>
            }
            {
               properties.length > 0 && properties.map((property, index) => (
                  <div className="flex gap-1 mb-2" key={index}>
                     <input
                        type="text"
                        className="mb-0"
                        value={property.name}
                        onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                        placeholder="Property name (e.g size)"
                        required
                     />
                     <input
                        type="text"
                        className="mb-0"
                        placeholder="Values (e.g sm, xl, lg)"
                        value={property.values}
                        onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                        required
                     />
                     <button
                        className="bg-green-900 text-white rounded-md px-2 my-0.5"
                        type="button"
                        onClick={() => removeProperty(index)}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                     </button>
                  </div>
               ))
            }
         </div>

         <div className="flex gap-1">
            {
               editedCategory && (
                  <button 
                     type="button"
                     className="btn-default"
                     onClick={()=>{
                        setEditedCategory(null);
                        setCategoryName('');
                        setParentCategory('');
                        setProperties([]);
                     }}
                  > Cancel</button>
               )
            }
            <button type="submit" className="btn-primary py-1 ">Save category</button>
         </div>

      </form>
      <hr className="my-5 h-2 shadow-md border-none"></hr>

      {
         !editedCategory && (
            <table className="basic">
               <thead>
                  <tr>
                     <td>Category Name</td>
                     <td>Parent Category</td>
                     <td></td>
                  </tr>
               </thead>
               <tbody>
                  {
                     loading ?
                        <tr className="flex justify-center items-center">
                           <p>Loading categories...</p><Spinner/>
                        </tr>

                     : allCategories ?
                        allCategories.map(category => (
                           <tr key={category._id} >
                              <td>{category.name}</td>
                              <td>{category?.parent?.name}</td>
                              <td className="">
                                 <button
                                    className="actionBtn mb-1 "
                                    onClick={() => editCategory(category)}
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                       </svg>
                                    Edit
                                 </button>
                                 <button
                                    className="actionBtn "
                                    onClick={() => deleteCategory(category)}
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Delete
                                 </button>
                              </td>
                           </tr>
                        ))
                        : <tr className="text-gray-500 text-center">No categories availabe to display. ( create new category )</tr>
                  }
               </tbody>
            </table>
         )
      }

   </Layout>
}

export default withSwal(({ swal }, ref) => (
   <Categories swal={swal} />
));

