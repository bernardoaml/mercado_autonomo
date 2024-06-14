import {Request, Response} from "express";
import { Product } from "./interface";
import products from "./database";

const getNextId = (): number =>{
    const lastProduct: Product | undefined = products
    .sort((a:Product, b:Product):number => a.id - b.id)
    .at(-1);

    if(!lastProduct) return 1;

    return lastProduct.id +1
}


const create = (req:Request, res:Response): Response =>{
    const newProduct: Product = {
        ...req.body,
        id:getNextId(),
        expirationDate: calculateExpirationDate(),
    }

    products.push(newProduct)

    return res.status(201).json(newProduct)
}

const calculateExpirationDate = (): Date => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setFullYear(currentDate.getFullYear() + 1);
    return expirationDate;
  };


const read = (req:Request, res:Response): Response =>{
    const allProducts = products;
    const totalPrice = allProducts.reduce((acc, product) => acc + product.price, 0)
    return res.status(200).json({ total: totalPrice, products})
}

const retrieve = (req:Request, res:Response):Response =>{
    const {foundProduct} = res.locals
    return res.status(200).json(foundProduct)
}

const destroy = (req:Request, res:Response ):Response=>{
    const {productIndex} = res.locals

        products.splice(productIndex, 1)

    return res.status(204).json();
}

const partialUpdate = (req:Request, res:Response):Response =>{

    const {id} = req.params
    const productIndex:number = products.findIndex(
        (v: Product): boolean => v.id === Number(id)
        )

        const updatedProduct = (products[productIndex] = {
            ...products[productIndex],
            ...req.body,


        })

    return res.status(200).json(updatedProduct)
}

export default { create, read, retrieve, destroy, partialUpdate }