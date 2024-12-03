import { mongooseConnect } from "@/lib/mongoose";
import { Product, product } from "@/models/products";

export default async function handleProducts(req, res) {
    const {method} = req;
    await mongooseConnect();
    // api for fetching products
    if (method === 'GET'){
        if(req.query?.p_id){
            res.json(await Product.findOne({_id:req.query.p_id}))
        }else{
            res.json(await Product.find());
        }
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
  