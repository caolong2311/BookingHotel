
import Home from './pages/Home/Home';
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Footer from './components/Footer/Footer';
import Booking from './pages/booking/Booking';
import Contact from './pages/Contact/Contact';
import RoomDetail from './pages/RoomDetail/RoomDetail';
import ScrollToTop from './components/ScrollToTop';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Order from './pages/order/order';
import Payment from './pages/Payment/Payment';
function App() {

  return (
    <>
      <Navbar></Navbar>
      <ScrollToTop></ScrollToTop>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dat-phong" element={<Booking />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/:roomName" element={<RoomDetail />} />
        <Route path="/order" element = {<Order/>}/>
        <Route path="/payment" element = {<Payment/>}/>
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App
