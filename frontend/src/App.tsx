import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import Confirmation from "./pages/Confirmation"

function App() {
 

  return (
    <>
    <Routes>
    <Route path='/' element={<Home></Home>}></Route>
    <Route path='/admin' element={<Admin></Admin>}></Route>
    <Route path='/confirmation' element={<Confirmation></Confirmation>}></Route>
    </Routes>
      <div>
       
      </div>
    </>
  )
}

export default App
