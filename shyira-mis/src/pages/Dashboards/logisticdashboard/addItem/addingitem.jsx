import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FaQuestionCircle, FaFileExcel,FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import './additem.css'
const AddItem = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/add`, {
        name,
        quantity,
        pricePerUnit,
        totalAmount,
      });
      console.log('Item added:', response.data);
    
      setModalMessage('Add new item in stock successful');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      // Clear form
      setName('');
      setQuantity('');
      setPricePerUnit('');
      setTotalAmount('');
    } catch (error) {
      console.error('Error adding item:', error);
      setModalMessage('Failed to Add new item in stock ');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }
  };
//uploading excel items logic
const [file, setFile] = useState(null);

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    console.log(jsonData); // Log the data to see its structure

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/uploadData`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
        
      });
  
      setModalMessage('upload items in stock successful');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error('Error uploading data:', error);
    
      setModalMessage('Failed to upload items data');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }
  };
  reader.readAsArrayBuffer(file);
}; 
  return (
    <div className='add-new-item'>
      <div className="additem">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price Per Unit:</label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Amount:</label>
          <input
            type="number"
            value={quantity*pricePerUnit}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
      </div>
    
      <div className="upload-data">
        <label htmlFor="">Here add items in stock with its data , with uploading file of .xlsx, .xls format</label>
       < input type="file" accept=".xlsx, .xls" onChange={handleFileChange}    required />
         <button className='upload-btn' onClick={handleUpload}> <FaFileExcel size={34} />Upload</button>
      
      <div className="upload-data-info">
      <label htmlFor="">Here is how excel column must be structure</label> 
      <div className="image-request-recieved">
          <img src="/image/excel.png" alt="Logo" className="logo" />
          </div>
      </div>
      </div>
            {/* Modal pop message on success or error message */}
            {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isSuccess ? (
              <div className="modal-success">
                <FaCheckCircle size={54} color="green" />
                <p>{modalMessage}</p>
              </div>
            ) : (
              <div className="modal-error">
                <FaTimesCircle size={54} color="red" />
                <p>{modalMessage}</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddItem;
