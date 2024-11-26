import { mongooseConnect } from "@/lib/mongoose";
import { Product, product } from "@/models/products";
import mongoose from "mongoose";

export default async function handleProducts(req, res) {
    const {method} = req;
    await mongooseConnect();
    if (method === 'POST'){
        const {title, description, price} = req.body;
        const productDoc = await Product.create({
            title, description, price
        })
        res.json(productDoc)
    }
}
  