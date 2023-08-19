import http from "http";
import { promises as fs } from "fs";

class ProductManager {
}
const Manager = new ProductManager("./products.json");

const server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
     
    } else if (req.method === "POST") {
        const urlParts = req.url.split("/");
        const [_, cartId, type, productId] = urlParts;

        if (type === "product" && cartId && productId) {
           
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", async () => {
                try {
                    const productData = JSON.parse(body);

                    
                    if (!productData.quantity) {
                        res.statusCode = 400;
                        res.end("Missing required field: quantity");
                        return;
                    }

                    const cart = Manager.getProductById(parseInt(cartId));
                    if (cart === "Not found") {
                        res.statusCode = 404;
                        res.end("Cart not found");
                        return;
                    }

                    const product = Manager.getProductById(parseInt(productId));
                    if (product === "Not found") {
                        res.statusCode = 404;
                        res.end("Product not found");
                        return;
                    }

                    const cartProduct = {
                        product: {
                            id: parseInt(productId),
                        },
                        quantity: productData.quantity,
                    };

                    cart.products.push(cartProduct);
                    await Manager.saveProducts();

                    res.statusCode = 201;
                    res.end("Product added to cart successfully");
                } catch (error) {
                    res.statusCode = 400;
                    res.end("Invalid JSON data");
                }
            });
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    } else {
        res.statusCode = 405;
        res.end("Method not allowed");
    }
});


server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
