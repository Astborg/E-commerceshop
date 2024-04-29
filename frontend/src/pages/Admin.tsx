import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Admin() {
    const [products, setProducts] = useState([]);
    const [ordersData, setOrdersData] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showOrders, setShowOrders] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState({
        _id: "",
        name: "",
        price: 0,
        stock: 0,
        details: "",
        category: 0
    });
    const [addSelectedProduct, setAddSelectedProduct] = useState({
        _id: "",
        name: "",
        price: 0,
        stock: 0,
        image: "",
        details: "",
        category: ""
    });


    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:3000/products');
                const data = await response.json();
                console.log(data)
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, [])

    useEffect(() => {
    async function fetchOrders() {
        try {
            const response = await fetch('http://localhost:3000/orders');
            const data = await response.json();
            console.log(data)
            setOrdersData(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    fetchOrders()
}, [])
    async function updateProduct(event:any) {
        event.preventDefault()
        try {
            
            const response = await fetch(`http://localhost:3000/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedProduct),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                setShowUpdateForm(false); 
            } else {
                console.error('Failed to update product:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }
    async function addProduct(event:any) {
        event.preventDefault()
        try {
            
            const response = await fetch(`http://localhost:3000/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addSelectedProduct),
            });

            if (response.ok) {
                console.log('Product added successfully');
                
            } else {
                console.error('Failed to add product:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }
    function handleChange(event:any) {
        const { name, value } = event.target;
        setSelectedProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    }
    function handleChange2(event:any) {
        const { name, value } = event.target;
        setAddSelectedProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    }

    const showUpdate = (product:any) => {
        setSelectedProduct(product);
        setShowUpdateForm(true);
    }

   
  return (
    <>
    <div>Products</div>
    <NavLink to="/"><button >Go back</button></NavLink>
    <h2>Add Product</h2>
                    <form onSubmit={addProduct}>
                        <label>
                            Name:
                            <input type="text" name="name" value={addSelectedProduct.name} onChange={handleChange2} />
                        </label>
                        <label>
                            Price:
                            <input type="number" name="price" value={addSelectedProduct.price} onChange={handleChange2} />
                        </label>
                        <label>
                            Image:
                            <input type="text" name="image" value={addSelectedProduct.image} onChange={handleChange2} />
                        </label>
                        <label>
                            Quantity:
                            <input type="number" name="stock" value={addSelectedProduct.stock} onChange={handleChange2} />
                        </label>
                        <label>
                            Details:
                            <input type="text" name="details" value={addSelectedProduct.details} onChange={handleChange2} />
                        </label>
                        <label>
                            Category:
                            <input type="text" name="category" value={addSelectedProduct.category} onChange={handleChange2} />
                        </label>
                        <button type="submit">Save</button>
                    </form>
    {showUpdateForm && (
                <div className="update-form">
                    <h2>Edit Product</h2>
                    <form onSubmit={updateProduct}>
                        <label>
                            Name:
                            <input type="text" name="name" value={selectedProduct.name} onChange={handleChange} />
                        </label>
                        <label>
                            Price:
                            <input type="number" name="price" value={selectedProduct.price} onChange={handleChange} />
                        </label>
                        <label>
                            Quantity:
                            <input type="number" name="stock" value={selectedProduct.stock} onChange={handleChange} />
                        </label>
                        <label>
                            Details:
                            <input type="text" name="details" value={selectedProduct.details} onChange={handleChange} />
                        </label>
                        <label>
                            Category:
                            <input type="text" name="category" value={selectedProduct.category} onChange={handleChange} />
                        </label>
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}
    {products.map((product:any) => (
        <div key={product.id} >
            <h1>{product.name}</h1>
            <img  src={product.image} style={{ width: '200px', height: '200px', borderRadius: '50%' }}></img>
            <p>{product.details}</p>
            <p>Pris: {product.price}</p>
            <p>Antal: {product.stock}</p>
            <p>Kategori: {product.category}</p>
            <button onClick={() => showUpdate(product)}>Update</button>
        </div>
    ))}
      
        <p>Orders</p>
        {ordersData.map((order:any) => (
            <div key={order.id}>
                <p>Customer:</p>
                <ul>
                    {order.customer.map((customer:any, index:number)=> (
                        <li key={index}>
                            <p>Email: {customer.Email}</p>
                            <p>Forname: {customer.ForName}</p>
                            <p>Lastname: {customer.LastName}</p>
                            <p>Street: {customer.Street}</p>
                            <p>StreetNumber: {customer.StreetNumber}</p>
                            <p>Postcode: {customer.Postcode}</p>
                            <p>City: {customer.City}</p>
                            <p>Password: {customer.Password}</p>
                        </li>
                    ))}
                </ul>
                <p>Products:</p>
                <ul>
                    {order.lineItems.map((item:any, index:number)=> (
                        <li key={index}>
                            <p>id: {item._id}</p>
                            <p>name: {item.name}</p>
                            <p>amount: {item.antal}</p>
                            <p>categoryId: {item.category}</p>
                            <p>details: {item.details}</p>
                            <p>price: {item.price}</p>
                            <p>status: {item.status}</p>
                            <p>stock:{item.stock}</p>
                            
                        </li>
                    ))}
                </ul>
                <p>orderDate: {order.orderDate}</p>
                <p>status: {order.status}</p>
                <p>totalPrice: {order.totalPrice}</p>
                <p>order_id: {order._id}</p>
            </div>
        ))}
        
        </>
       )}



   
  

