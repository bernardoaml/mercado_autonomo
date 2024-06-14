import express, { Application,  json } from "express";
import logics from "./logics";
import products from "./database";
import middlewares from "./middlewares";

const app: Application = express();
app.use(json())

app.post("/products", middlewares.uniqueName, logics.create);

app.get("/products", logics.read);
const allProducts = products;
const totalPrice = allProducts.reduce((acc, product) => acc + product.price, 0);

app.use("/products/:id", middlewares.idExists);

app.get("/products/:id",  logics.retrieve);
app.delete("/products/:id",  logics.destroy);
app.patch("/products/:id", middlewares.uniqueName, logics.partialUpdate);


const PORT:number = 3000;
app.listen(PORT, (): void => {
    console.log(`Application is running on port: ${PORT}`)
});

