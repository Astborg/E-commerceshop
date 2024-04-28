console.log('index.js')
const cors = require('cors')
let express = require('express')
let DatabaseConnection = require('./src/database/databaseConnection')


let app = express()
let url = 'mongodb://localhost:27017'

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded())

app.get('/', async (request, response) => {
    
    let orders = await DatabaseConnection.getInstance().getAllOrders()
    response.json(orders)

})

app.get('/products', async (request, response) => {
    try {
        const products = await DatabaseConnection.getInstance().getAllProducts();
        response.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post("/products", async (request, response) => {
    
    let id = await DatabaseConnection.getInstance().createProduct();
    await DatabaseConnection.getInstance().updateProduct(id, request.body);

    response.json({"id": id});

});
app.post("/create-order", async (request, response) => {
    
    
    const {lineItems} = request.body
    const {customer} = request.body
    let orderId = await DatabaseConnection.getInstance().saveOrder(request.body.lineItems)
    // let customerId = await DatabaseConnection.getInstance().saveOrder(request.body.customer)
    console.log('OrderId', orderId, lineItems, customer)
    response.json({"id": orderId, 'customer': customer});

});

app.put("/products/:id", async (request, response) => {
    
    await DatabaseConnection.getInstance().updateProduct(request.params.id, request.body);

    response.json({"id": request.params.id});

});
// app.post('/products/:productId', async (req, res) => {
//     const { productId } = req.params;
//     const { name, price, stock, details } = req.body;

//     try {
//         // Create an instance of the Product class with the provided data
//         const product = new Product(productId, name, price, stock, details);

//         // Call the update method on the product instance
//         const modifiedCount = await product.update(name, price, stock, details);

//         if (modifiedCount === 1) {
//             res.json({ message: 'Product updated successfully' });
//         } else {
//             res.status(404).json({ error: 'Product not found' });
//         }
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
app.listen(3000)