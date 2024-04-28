import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Admin() {
    const [products, setProducts] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
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
       



    </>
  )
}
