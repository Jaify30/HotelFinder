import { BrowserRouter, Route, Routes } from "react-router-dom"
import Index from "./components/Index"
import CrearCuenta from "./components/CrearCuenta"
import CrearHotel from "./components/CrearHotel"
import HotelesPage from "./components/HotelesPage"
import AdminPanel from "./components/AdminPanel"
import AgregarHabitaciones from "./components/AgregarHabitaciones"
import VerHotel from "./components/VerHotel"
import PagosPage from "./components/PagosPage"
import MisReservas from "./components/MisReservas"
import CrearResena from "./components/CrearResena"
import AdminHabitaciones from "./components/AdminHabitaciones"
import HotelDashboard from "./components/HotelDashBoard"
import SobreNosotros from "./components/SobreNosotros"
import Footer from "./components/Footer"



function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/Crear" element={<CrearCuenta/>}></Route>
        <Route path="/CrearHotel" element={<CrearHotel/>}></Route>
        <Route path="/Hoteles" element={<HotelesPage/>}></Route>
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/AgregarHabitaciones/:id" element={<AgregarHabitaciones/>} />
        <Route path="/hotel/:id" element={<VerHotel/>}/>
        <Route path="/PagosPage" element={<PagosPage />}/>
        <Route path="/MisReservas" element={<MisReservas />} />
        <Route path="/CrearResena" element={<CrearResena />} />
        <Route path="/Admin/Habitaciones/:idHotel" element={<AdminHabitaciones />} />
        <Route path="/HotelDashBoard/:idHotel" element={<HotelDashboard/>}/>
        <Route path="SobreNosotros" element={<SobreNosotros/>}/>

      </Routes>
    </BrowserRouter>
    <Footer/>
    </>
  )
}

export default App
