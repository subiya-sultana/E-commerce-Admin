import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";


export default async function handleCategories(req, res) {
    const {method} = req;
    await mongooseConnect();

    // api for creating new category
    if (method === 'POST') {
        const { categoryName, parentCategory } = req.body;

        if (!categoryName) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        try {
            const CategoryDoc = await Category.create({ name: categoryName, parent: parentCategory });
            res.status(201).json(CategoryDoc);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create category', details: error.message });
        }
    }

    // API for fetching categories
    if(method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

}