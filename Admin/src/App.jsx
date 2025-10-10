import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import CheckIn from './pages/CheckIn/CheckIn'
import CheckOut from './pages/CheckOut/CheckOut'
import DichVu from './pages/DichVu/DichVu'
import HoaDon from './pages/HoaDon/HoaDon'
function App() {

  return (
    <>
      <div className="app-content">
        <Sidebar />
        <Routes>
           <Route path="/" element={<CheckIn />} />
           <Route path="/check-out" element={<CheckOut />} />
           <Route path="/dich-vu" element={<DichVu />} />
           <Route path="/hoa-don" element={<HoaDon />} />
        </Routes>
      </div>
    </>
  )
}

export default App

