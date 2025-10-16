import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import CheckIn from './pages/CheckIn/CheckIn'
import CheckOut from './pages/CheckOut/CheckOut'
import DichVu from './pages/DichVu/DichVu'
import KhachHang from './pages/KhachHang/KhachHang'

function App() {

  return (
    <>
      <div className="app-content">
        <Sidebar />
        <Routes>
           <Route path="/" element={<CheckIn />} />
           <Route path="/check-out" element={<CheckOut />} />
           <Route path="/dich-vu" element={<DichVu />} />
           <Route path="/khach-hang" element={<KhachHang />} />
        </Routes>
      </div>
    </>
  )
}

export default App

