import React, { useState } from 'react';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import '../../logisticdashboard/Navigationbar/Navigationbar.css';
import axios from 'axios';

const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    fuelrequest:false,
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

 //handle logout
 const handleLogout = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`); // Notify the server of the logout

    // Remove token from local storage or cookies
    localStorage.removeItem('authToken'); // Adjust based on how you store tokens

    // Optionally, redirect to login page
    window.location.href = '/'; // Adjust the URL as needed
  } catch (error) {
    console.error('Logout failed:', error);
    // Handle errors (e.g., show a message to the user)
  }
};

  return (
    <div className="navigation">
      <h2>Direct General</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}><FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-stock-items')}> <FaList /> Available Items</li>
        <li onClick={() => toggleDropdown('request')} className="dropdown">
        <FaBoxOpen />  Item Requisition
          {dropdownsOpen.request && (
            <ul className="dropdown-menu">
              <li onClick={() => setCurrentPage('view-logistic-request')}><FaList /> View logistic Request verified</li>
              <li onClick={() => setCurrentPage('view-request')}><FaList /> View Other Request</li> 
              <li onClick={() => setCurrentPage('view-aproved')}><FaClipboardCheck/> Approved Request</li>
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('fuelrequest')} className="dropdown">
        <FaGasPump />  Fuel Requisition
          {dropdownsOpen.fuelrequest && (
            <ul className="dropdown-menu">
              <li onClick={() => setCurrentPage('view-fuel-request')}><FaList /> View Request</li>
              <li onClick={() => setCurrentPage('viewfuel-aproved')}><FaClipboardCheck/> Approved Request</li>
            </ul>
          )}
        </li>
      </ul>
      
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}>< FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
