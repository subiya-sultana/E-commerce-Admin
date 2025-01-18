// Schema for products collection
import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
        title: { type: String, required: true },
        category: { type: mongoose.Types.ObjectId, ref: 'Category', default: null},
        properties: {type:Object},
        images: [{type:String}],
        description: { type: String, required: true },
        price: { type: Number, required: true },
    }, 
    {
        timestamps: true,
    }
);

// Use `models.product` if it exists, otherwise create a new model
export const Product = models.Product || model("Product", ProductSchema);
