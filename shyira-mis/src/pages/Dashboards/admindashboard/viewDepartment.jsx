import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import './css/service.css'
import axios from 'axios';

const ViewDepartment = () => {
  
    

  const [departments, setDepartments] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleEditClick = (department) => {
    setEditDepartment(department);
    setDepartmentName(department.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/departments/${editDepartment._id}`, {
        name: departmentName,
      });
      setEditDepartment(null);
      setDepartmentName('');
      // Fetch updated positions
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/departments/${id}`);
      console.log('Delete response:', response.data); // Log the response
      // Fetch updated positions
      const fetchUpdatedPositions = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/departments`);
      setDepartments(fetchUpdatedPositions.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  return (
    <div className="service-data">
         <h1>Departments List</h1>
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
            {departments.map((department, index) => (
              <tr key={department._id}>
                <td>{index+1}</td>
                <td>{department.name}</td>
                <td>
                <button onClick={() => handleEditClick(department)}>Edit</button>
                <button onClick={() => handleDelete(department._id)}><FaTrash color='red'/></button>

                </td>
               
               
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {editDepartment && (
        <div className="edit-form">
          <h2>Edit Department</h2>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditDepartment(null)}>Cancel</button>
        </div>
      )}  
       
    </div>
  );
};

export default ViewDepartment;