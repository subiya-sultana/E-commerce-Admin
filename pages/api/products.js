// handling api's for the product page... hence editing database here, fetching products etc
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/products";

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

    // api for updating products
    if (method === 'PUT'){
        const {_id, title, description, price} = req.body;
        await Product.updateOne({_id}, {title, description, price})
        res.json(true);
    }

    // api for deleting product
    if (method === 'DELETE'){
        if(req.query?.p_id){
            const {_id} = req.body;
            await Product.deleteOne({_id:req.query?.p_id})
            res.json(true)
        }
    }
}
  