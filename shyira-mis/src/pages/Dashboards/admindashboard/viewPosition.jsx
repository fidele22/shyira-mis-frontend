import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/service.css';

const ViewPosition = () => {
  const [positions, setPositions] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [positionName, setPositionName] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions`);
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/positions/${id}`);
      // Fetch updated positions
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  return (
    <div className="service-data">
      <h1>Positions List</h1>
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
            {positions.map((position, index) => (
              <tr key={position._id}>
                <td>{index + 1}</td>
                <td>{position.name}</td>
                <td>
                  <button onClick={() => handleEditClick(position)}>Edit</button>
                  <button onClick={() => handleDelete(position._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editPosition && (
        <div className="edit-form">
          <h2>Edit Position</h2>
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditPosition(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewPosition;
