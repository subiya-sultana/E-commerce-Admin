import { mongooseConnect } from "@/lib/mongoose";
import { Product, product } from "@/models/products";
import mongoose from "mongoose";
import Products from "../products";

export default async function handleProducts(req, res) {
    const {method} = req;
    await mongooseConnect();
    // api for fetching products
    if (method === 'GET'){
        res.json(await Product.find());
    }

    // api for creating products
    if (method === 'POST'){
        const {title, description, price} = req.body;
        const productDoc = await Product.create({
            title, description, price
        })
        res.json(productDoc)
    }
}
  