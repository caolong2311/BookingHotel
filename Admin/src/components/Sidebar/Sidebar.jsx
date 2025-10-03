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
            </div>
        </div>
    )
}

export default Sidebar
