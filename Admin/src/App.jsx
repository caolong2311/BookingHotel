import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import CheckIn from './pages/CheckIn/CheckIn'
import CheckOut from './pages/CheckOut/CheckOut'
function App() {

  return (
    <>
      <div className="app-content">
        <Sidebar />
        <Routes>
           <Route path="/" element={<CheckIn />} />
           <Route path="/check-out" element={<CheckOut />} />
        </Routes>
      </div>
    </>
  )
}

export default App

