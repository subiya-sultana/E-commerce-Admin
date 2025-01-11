import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Types.ObjectId, ref: 'Category', default: null }, 
    properties: [{type: Object}]
    
    // description: { type: String, required: true },
    // price: { type: Number, required: true },
});

// Use existing model or create a new one
export const Category = models?.Category || model("Category", CategorySchema);
