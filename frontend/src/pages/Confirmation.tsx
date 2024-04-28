import { NavLink } from "react-router-dom";


export default function Confirmation() {
  return (
    <div><h1>
        Thank you for your order! Payment is successfully managed!
        </h1>
        <NavLink to='/'><button>Go back</button></NavLink>
    </div>
  )
}
