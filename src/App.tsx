import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "./components/Index"
import CrearCuenta from "./components/CrearCuenta"
import CrearHotel from "./components/CrearHotel"
import HotelesPage from "./components/HotelesPage"
import AdminPanel from "./components/AdminPanel"
import AgregarHabitaciones from "./components/AgregarHabitaciones"
import VerHotel from "./components/VerHotel"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/Crear" element={<CrearCuenta/>}></Route>
        <Route path="/CrearHotel" element={<CrearHotel/>}></Route>
        <Route path="/Hoteles" element={<HotelesPage/>}></Route>
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/AgregarHabitaciones/:id" element={<AgregarHabitaciones/>} />
        <Route path="/hotel/:id" element={<VerHotel/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
