const DatabaseConnection = require('./src/database/databaseConnection');

async function testGetAllProducts() {
    try {
        const dbConnection = new DatabaseConnection();
        await dbConnection.connect(); // Ensure the connection is established
        const products = await dbConnection.getAllProducts();

        console.log('Products:', products);
        console.log('Test passed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testGetAllProducts();