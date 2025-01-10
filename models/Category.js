import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Types.ObjectId, ref:'Category' }
    // description: { type: String, required: true },
    // price: { type: Number, required: true },
});

// Use `models.product` if it exists, otherwise create a new model
export const Category = models?.Category || model("Category", CategorySchema);
