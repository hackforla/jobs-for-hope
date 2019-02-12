import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => (
  <nav className='navbar' id='myNavbar'>
    <div className='org'>
      <img id='org-image' alt='logo' src='http://dpss.lacounty.gov/wps/wcm/connect/ec46eaad-0452-4c31-8087-4d703908fff5/1/unspecified-3.png?MOD=AJPERES&CACHEID=ec46eaad-0452-4c31-8087-4d703908fff5/1' />
    </div>
    <div className='nav-links'>
      <ul>
        <li><NavLink className='link' to='/' exact>Jobs</NavLink></li>
        <li><NavLink className='link' to='/organizations'>Organizations</NavLink></li>
        <li><NavLink className='link' to='/about'>About</NavLink></li>
        <li><NavLink className='link' to='/contact'>Contact</NavLink></li>
      </ul>
    </div>
  </nav>
)

export default Navbar
