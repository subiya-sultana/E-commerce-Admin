import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

// Use `models.product` if it exists, otherwise create a new model
export const Product = models.Product || model("Product", ProductSchema);
