import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import CheckIn from './pages/CheckIn/CheckIn';
import CheckOut from './pages/CheckOut/CheckOut';
import DichVu from './pages/DichVu/DichVu';
import KhachHang from './pages/KhachHang/KhachHang';
import Login from './pages/Login/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();


  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    navigate("/check-in");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route
            path="/check-in"
            element={
              <div className="app-content">
                <Sidebar onLogout={handleLogout} />
                <CheckIn />
              </div>
            }
          />
          <Route
            path="/check-out"
            element={
              <div className="app-content">
                <Sidebar onLogout={handleLogout} />
                <CheckOut />
              </div>
            }
          />
          <Route
            path="/dich-vu"
            element={
              <div className="app-content">
                <Sidebar onLogout={handleLogout} />
                <DichVu />
              </div>
            }
          />
          <Route
            path="/khach-hang"
            element={
              <div className="app-content">
                <Sidebar onLogout={handleLogout} />
                <KhachHang />
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/check-in" replace />} />
          <Route path="*" element={<Navigate to="/check-in" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
