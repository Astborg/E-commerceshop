import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import CartPopOut from "./CartPopUp";

export default function Products() {
    interface Product {
        _id: string;
        name: string;
        details: string;
        image: string;
        stock: number;
        price: number
    }
    
    interface ProductWithSelection extends Product {
        
        selected: boolean;
        antal: number;
    }
    const [products, setProducts] = useState<ProductWithSelection[]>([]);
    const [showCart, setShowCart] = useState(false);

    
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:3000/products');
                const data = await response.json();
                console.log(data)
                setProducts(data.map((product: Product) => ({
                    ...product,
                    selected: false,
                    antal: 0
                })));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, []);

    const handleProductSelection = (productId: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product._id === productId
                    ? { ...product, selected: true }
                    
                    : product
                   
            )
        );
       
    };
    
    const handleQuantity = (productId: string) => {
        console.log('handlequantity funkar')
        
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product._id === productId
                    ? { ...product, antal: product.antal + 1 }
                    : product
            )
        );
        console.log(products)
    };
    console.log("Products array:", products)
  return (
    <>
     <button onClick={() => setShowCart(!showCart)}>Visa Kundvagn</button>
      {showCart && <CartPopOut products={products.filter((product) => product.selected)} setProducts={setProducts}  />}
      {console.log("Products passed to CartPopOut:", products)}

    <div>Products</div>
    <NavLink to="/admin"><button >Admin</button></NavLink>
    {products.map((product:any) => (
        <div key={product._id} onClick={() => handleProductSelection(product._id)} >
            <h1>{product.name}</h1>
            <img src={product.image} style={{ width: '200px', height: '200px', borderRadius: '50%' }}></img>
            <p>{product.details}</p>
            <p>Pris: {product.price}</p>
            <p>Antal: {product.antal}</p>
            <button onClick={() =>handleQuantity(product._id)}>Köp</button>
        </div>
    ))}

    </>
  )
}
