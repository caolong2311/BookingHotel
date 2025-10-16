import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Check-in</p>
                </NavLink>

                <NavLink to='/check-out' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Check-out</p>
                </NavLink>
                <NavLink to='/dich-vu' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Dịch vụ</p>
                </NavLink>
                <NavLink to='/khach-hang' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Khách hàng</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
