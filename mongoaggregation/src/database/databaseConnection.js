let mongodb = require('mongodb')
let instance = null

class DatabaseConnection{

    constructor(){
        console.log('DatabaseConnection::constructor')

        this.clent=null
        this.url= 'mongodb://localhost:27017'

        this.debugId = Math.floor(Math.random()* 100000)

    }
    setUrl(url){
        this.url = url
    }

    async connect() {
        try {
            if (!this.client) {
                this.client = new mongodb.MongoClient(this.url, { useUnifiedTopology: true });
                await this.client.connect();
            }
            return this.client.db(); // Return the connected database
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            await this.connect(); // Ensure the connection is established
    
            const db = this.client.db('shop'); // Connect to the appropriate database
            const collection = db.collection('products'); // Access the products collection
    
            // Fetch all products from the collection
            const products = await collection.find({}).toArray();
            
            return products;
            
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
    async updateProduct(id, productData) {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        await collection.updateOne({"_id": new mongodb.ObjectId(id)}, {"$set": {
            "name": productData["name"],
            "details": productData["details"],
            "stock": productData["stock"]*1,
            "price": productData["price"]*1,
            "category": productData["category"] ? new mongodb.ObjectId(productData["category"]) : null
        }});
    }
    async createProduct() {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        let result = await collection.insertOne({"status": "draft", "name": null, "details": null, "image": null, "stock": 0, "price": 0, "category": null});

        return result.insertedId;
    }
    async saveOrder(lineItems, customer) {
        console.log('lineItems', lineItems)
        console.log('customer', customer)
        
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("orders");

        let result = await collection.insertOne({"customer": customer, "orderDate": new Date(), "status": "paid", "totalPrice": 0, 'lineItems': lineItems}); 

        let orderId = result.insertedId;
        if (lineItems && lineItems.length > 0 ) {
        let encodedLineItems = lineItems.map((lineItem) => {
            return {
                "amount": lineItem["amount"],
                "totalPrice": 0,
                "order": new mongodb.ObjectId(orderId),
                "product": new mongodb.ObjectId(lineItem["product"]),
            }
        })
    
        let lineItemsCollection = db.collection("lineItems");
        await lineItemsCollection.insertMany(encodedLineItems)

        
    } else {
        console.error('Line items array is empty or undefined');
        // Handle the case where lineItems is empty or undefined
    }
    return result.insertedId;
    }
    async getAllOrders() {
        await this.connect()
        let db = this.client.db('shop')
        let collection = db.collection('orders')

        let pipeline = [
            {
            $lookup: {
                from: "lineItems",
                localField: "orderId",
                foreignField: "id",
                as: "lineItems",
                pipeline: [
                {
                    $lookup: {
                    from: "products",
                    localField: "id",
                    foreignField: "product",
                    as: "linkedProduct",
                    },
                },
                {
                    $addFields: {
                    linkedProduct: {
                        $first: "$linkedProduct",
                    },
                    },
                },
                ],
            },
            },
            {
            $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                from: "customers",
                localField: "id",
                foreignField: "customer",
                as: "linkedCustomer",
                },
            },
            {
            $addFields:
                /**
                 * newField: The new field name.
                 * expression: The new field expression.
                 */
                {
                linkedCustomer: {
                    $first: "$linkedCustomer",
                },
                calculatedTotal: {
                    $sum: "$lineItems.totalPrice",
                },
                },
            },
        ]

        let aggregate = collection.aggregate(pipeline)

        let orders = []

        for await (let document of aggregate){
            orders.push(document)
        }
        return orders
    }

    async getOrCreateCustomer(email, name, address){
        return {"id": 1223344}
    }

    

    static getInstance(){
        if(instance === null){
            instance = new DatabaseConnection()
        }
        return instance
    }
}

module.exports = DatabaseConnection