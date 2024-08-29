import React, { useState } from 'react';
import axios from 'axios';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import './Hodnavigationbar.css';



const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    fuelrequisitions:false,
    requisitionsstatus:false
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
      <h2>HOD Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}>  <FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-items')}> <FaList /> Available Items</li>
        
        <li onClick={() => toggleDropdown('requisitions')} className="dropdown">
        <FaClipboardList /> Request Item
          {dropdownsOpen.requisitions && (
            <ul className="dropdown-menu">
              <li onClick={() => setCurrentPage('requisition')}><FaBoxOpen /> Make requisition</li>
            
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('fuelrequisitions')} className="dropdown">
        <FaGasPump /> Request Fuel
          {dropdownsOpen.fuelrequisitions && (
            <ul className="dropdown-menu">
             <li onClick={() => setCurrentPage('fuel-request')}><FaBoxOpen size={24} /> Make Request Fuel</li>
             <li onClick={() => setCurrentPage('veiw-fuel-request')}><FaGasPump size={24} />View Request Fuel</li>
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('requisitionsstatus')} className="dropdown">
        <FaGasPump /> Request Status
          {dropdownsOpen.requisitionsstatus && (
            <ul className="dropdown-menu">
          <li onClick={() => setCurrentPage('view-aproved')}><FaClipboardList /> Aproved Request</li> 
             <li onClick={() => setCurrentPage('view-request-jected')}><FaGasPump size={24} />Rejected Request</li>
            </ul>
          )}
        </li>
 
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('logistic-profil')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
