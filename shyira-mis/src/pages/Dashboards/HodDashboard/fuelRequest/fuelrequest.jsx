import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './fuelrequest.css'; // Make sure to add CSS for styling

const RequisitionForm = () => {
  const [requesterName, setRequesterName] = useState('');
  const [carPlaque, setCarPlaque] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [remainingLiters, setRemainingLiters] = useState('');
  const [average, setAverage] = useState('');
  const [quantityRequested, setQuantityRequested] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('');
  const [destination, setDestination] = useState('');
  const [reasonOption, setReasonOption] = useState('');
  const [file, setFile] = useState(null); // New state for file
  const [user, setUser] = useState(null);

  const [carOptions, setCarOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const carResponse = await axios.get('http://localhost:5000/api/forms-data/cars');
        setCarOptions(carResponse.data);

        const reasonResponse = await axios.get('http://localhost:5000/api/forms-data/reasons');
        setReasonOptions(reasonResponse.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!requesterName || !carPlaque || !kilometers || !quantityRequested) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('requesterName', requesterName);
    formData.append('carPlaque', carPlaque);
    formData.append('kilometers', kilometers);
    formData.append('remainingLiters', remainingLiters);
    formData.append('average', average);
    formData.append('quantityRequested', quantityRequested);
    formData.append('quantityReceived', quantityReceived);
    formData.append('destination', destination);
    formData.append('reasonOption', reasonOption);
    formData.append('hodName', user ? `${user.firstName} ${user.lastName}` : '');
    formData.append('hodSignature', user && user.signature ? user.signature : '');
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/fuel-requisition/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('Requisition submitted successfully!');
      
      setRequesterName('');
      setCarPlaque('');
      setKilometers('');
      setAverage('');
      setRemainingLiters('');
      setQuantityRequested('');
      setQuantityReceived('');
      setDestination('');
      setReasonOption('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting requisition:', error);
      alert('Error submitting requisition');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="requisition-form">
   
     
        <form onSubmit={handleSubmit}>
        <div className="image-logo">
            <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
         <h2>Fuel Requisition Form</h2> 
        <div className="left-content">
          <div className="form-group">
            <label htmlFor="requesterName">Name of Requester:</label>
            <input
              type="text"
              id="requesterName"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="carPlaque">Plaque of Car:</label>
            <select
              id="carPlaque"
              value={carPlaque}
              onChange={(e) => setCarPlaque(e.target.value)}
              required
            >
              <option value="">Select Plaque</option>
              {carOptions.map((car) => (
                <option key={car._id} value={car.registerNumber}>
                  {car.registerNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="kilometers">Kilometers:</label>
            <input
              type="number"
              id="kilometers"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="remainingliters">Remaining Liters:</label>
            <input
              type="number"
              id="remainingliters"
              value={remainingLiters}
              onChange={(e) => setRemainingLiters(e.target.value)}
              required
            />
          </div>

        

          <div className="form-group">
            <label htmlFor="quantityRequested">Quantity Requested (liters):</label>
            <input
              type="number"
              id="quantityRequested"
              value={quantityRequested}
              onChange={(e) => setQuantityRequested(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantityReceived">Quantity Received (liters):</label>
            <input
              type="number"
              id="quantityReceived"
              value={quantityReceived}
              
            />
          </div>
          </div>
    

      <div className="right-content">
        <div className="form-group">
        <div className="form-group">
            <label htmlFor="destination">Previous Destination Report:</label>
            <input
              type="file"
              id="destination"
              onChange={handleFileChange}
            />
          </div>
        </div>
       </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Submit</button>
        </div>
        </form>
       


        <div className="form-group">
          <label>HOD Signature:</label>
          {user && user.signature ? (
            <img src={user.signature} alt="HOD Signature" className="signature" />
          ) : (
            <p>No signature available</p>
          )}
        </div>

       
      </div>
    
  );
};

export default RequisitionForm;
