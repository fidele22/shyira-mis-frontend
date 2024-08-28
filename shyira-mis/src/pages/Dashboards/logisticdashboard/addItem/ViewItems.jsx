import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataDisplay = ({ onItemSelect }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  // Filter data based on search query
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/${id}`);
        // Fetch updated data
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks`);
        setData(response.data);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  }
  return (
    <div>
      <h2>Item list</h2>
      <h3> Here are Items in stored in stock with its updated balance</h3>
         {/* Search input field */}
         <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.pricePerUnit}</td>
              <td>{item.totalAmount}</td>
              <td>
                <button className='stock-details-btn' onClick={() => onItemSelect(item)}>View Stock Details</button>
                <button className='delete-btn' onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataDisplay;
