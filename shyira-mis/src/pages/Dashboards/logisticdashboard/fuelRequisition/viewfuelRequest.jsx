// frontend/src/components/FuelRequisitionForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewfuelrequest.css';

const FuelRequisitionForm = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fuel-requisition');
        setRequisitions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
        setError('Failed to fetch requisitions');
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/fuel-requisition/${requestId}`);
      setSelectedRequest(response.data);
      setFormData(response.data);
      setIsEditing(false);

      setRequisitions((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, clicked: true } : req
        )
      );
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/fuel-requisition/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      setIsEditing(false);

      // Optional: Forward the updated requisition to another collection
      // await axios.post('http://localhost:5000/api/forwarded-collection', response.data);
    } catch (error) {
      console.error('Error updating requisition:', error);
    }
  };

  const handleCloseClick = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fuel-requisition-form">
      <h2>Fuel Requisition</h2>

      <div className="navigate-request">
        <ul>
          {requisitions.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from {request.department} done on {new Date(request.date).toDateString()}
                <span>{!request.clicked ? 'New Request' : ''}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {selectedRequest && (
        <div className="fuel-request-details">
          <h3>Fuel Requisition form</h3>
          <form>
            <div className="view-form-group">
              <label>Requester Name: <span>{selectedRequest.requesterName || ''}</span></label>
                
            
            </div>
            <div className="view-form-group">
              <div className="right-side">
              <label>Car Plaque:</label>
             
             <span>{selectedRequest.carPlaque || ''}</span>
              </div>
              <div className="left-side">
              <label>Remaining (liters):</label>
             
                <span>{selectedRequest.quantityRequested || ''}</span>
             
            </div>
             
             
            </div>
            <div className="view-form-group">
            <div className="right-side">
              <label>Kilometers:</label>
           
           <span>{selectedRequest.kilometers || ''}</span>
              </div>
              <div className="right-side">
              <label>Quantity Requested (liters):</label>
             
                <span>{selectedRequest.quantityRequested || ''}</span>
             
            </div> 
             
              
            </div>
            
            <div className="view-form-group">
            <div className="left-side">
              <label>Average Km/l:</label>
             
             <span>{selectedRequest.average || ''}</span>
              </div>
              <div className="left-side">
              <label>Quantity Received (liters):</label>
              {isEditing ? (
                <input
                  type="number"
                  name="quantityReceived"
                  value={formData.quantityReceived || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{selectedRequest.quantityReceived || ''}</span>
              )}
            </div>
            
            </div>
            
            <div className="view-form-group">
              <div className="right-side">
              <label>Destination:</label>
           
           <span>{selectedRequest.destination || ''}</span>
              </div>
              <div className="left-side">
              <label>Reason</label>
            
                <span>{selectedRequest.reason || ''}</span>
           
            </div> 
          
            </div>
           
            <hr />
            <div className="signatures">
              <div className="hod">
                <p>Prepared By:</p>
              
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
              
              </div>
            </div>
            {isEditing ? (
              <div className="form-buttons">
                <button type="button" onClick={handleSaveClick}>
                  VerifY
                </button>
                <button type="button" onClick={handleCloseClick}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="form-buttons">
                <button type="button" onClick={handleEditClick}>
                  Edit
                </button>
                <button type="button" onClick={handleCloseClick}>
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default FuelRequisitionForm;
