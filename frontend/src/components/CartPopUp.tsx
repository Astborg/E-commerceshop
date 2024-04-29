import { useState } from "react";
import { NavLink } from "react-router-dom";

const CartPopOut = ({ products, setProducts }: { products: any, setProducts:any }) => {
    console.log("Products received by CartPopOut:", products); 
    const totalAmount = products.reduce((acc: any, product: any) => acc + product.price * product.antal, 0);
    const [adress, setAdress] = useState({
      Email: "",
      ForName: "",
      LastName: "",
      Street: "",
      StreetNumber: "",
      Postcode: "",
      City: "",
      Password: ""
})

    const handleChange = (event) => {
      event.preventDefault()
      
      const { name, value } = event.target;
      console.log({[name]: value});
        setAdress(prevAdress => ({
            ...prevAdress,
            [name]: value
        }));
        
        console.log(adress)
    }

    const handleClick = async () => {
      
        try {
          const lineItems = products.filter(product => product.selected)
          const customer = [adress]
          console.log(customer)
            const response = await fetch('http://localhost:3000/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({lineItems, customer}),
            });
    
            console.log(lineItems)
            if (response.ok) {
                alert('Order successfully sent and payed, thank you for your order.');
                // Återställ varukorgen efter att ordern har skickats
               setProducts([])
            } else {
                console.error('Failed to send order:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending order:', error);
        }
    }
    return (
      <div >
        
        <h2>Kundvagn</h2>
        <ul>
          {products.map((product: any) => (
            <li key={product._id}>
              <span>{product.name}</span>
              <span>Antal: {product.antal}</span>
              <span>Pris: {product.price}</span>
            </li>
          ))}
        </ul>
        <p>Totalt: {totalAmount}</p>
        <label>
            Email:</label>
        <input type="text" name="Email" value={adress.Email} onChange={(event) => handleChange(event)} />
        
        <label>
            ForName:</label>
        <input type="text" name="ForName" value={adress.ForName} onChange={(event) => handleChange(event)} />
        
        <label>
          LastName:
        <input type="text" name="LastName" value={adress.LastName} onChange={(event) => handleChange(event)} />
        </label>
        <label>
          Adress street:
        <input type="text" name="Street" value={adress.Street} onChange={(event) => handleChange(event)}/>
        </label>
        <label>
        Adress streetnumber:
        <input type="text" name="StreetNumber" value={adress.StreetNumber} onChange={(event) => handleChange(event)} />
        </label>
        <label>
        Adress postcode:
        <input type="text" name="Postcode" value={adress.Postcode} onChange={(event) => handleChange(event)} />
        </label>
        <label>
        Adress city:</label>
        <input type="text" name="City" value={adress.City} onChange={(event) => handleChange(event)} />
        
        <label>
          Password:
        <input type="text" name="Password" value={adress.Password} onChange={handleChange} />
        </label>
        <NavLink to='/confirmation'><button onClick={handleClick} >Pay order</button></NavLink>
        
      </div>
      
    );
  };
  
  export default CartPopOut;