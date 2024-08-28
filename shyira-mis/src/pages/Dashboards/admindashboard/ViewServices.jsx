import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import './css/service.css'
import axios from 'axios';

const ViewService = () => {
  
    


  const [services, setServices] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [serviceName, setserviceName] = useState('');


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchServices();
  }, []);

  
  const handleEditClick = (position) => {
    setEditPosition(position);
    setPositionName(position.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/positions/${editPosition._id}`, {
        name: positionName,
      });
      setEditPosition(null);
      setPositionName('');
      // Fetch updated positions
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/positions/${id}`);
      console.log('Delete response:', response.data); // Log the response
      // Fetch updated positions
      const fetchUpdatedPositions = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions`);
      setPositions(fetchUpdatedPositions.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };
  

  return (
    <div className="service-data">
         <h1>Services List</h1>
        <div className="service-table-data">
       
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Action</th>
             
              
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index+1}</td>
                <td>{service.name}</td>
                <td>
                    <button>edit</button>
                    <button><FaTrash  color='red'/></button>

                </td>
               
               
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>
         
       
   
      {editPosition && (
        <div className="edit-form">
          <h2>Edit Service</h2>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setserviceName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditPosition(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewService;