import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../../assets/assets'
const Navbar = () => {
  const [menu, setMenu] = useState("GioiThieu");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* <div className="nav-logo">
        <Link to='/'>
          <img src={assets.icon3} alt="Logo" className="logo-img" />
        </Link>
      </div> */}
      <ul className="nav-links">
        <li className={menu === "GioiThieu" ? "active" : ""}>
          <Link to='/' onClick={() => setMenu("GioiThieu")}>Trang chủ</Link>
        </li>
        <li className={menu === "DatPhong" ? "active" : ""}>
          <Link to='/dat-phong' onClick={() => setMenu("DatPhong")}>Đặt phòng</Link>
        </li>
        <li className={menu === "LienHe" ? "active" : ""}>
          <Link to='/lien-he' onClick={() => setMenu("LienHe")}>Liên hệ</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
