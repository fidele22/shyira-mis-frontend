import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle,FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './ViewApprovedRequest.css'; // Import CSS for styling

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchParams, setSearchParams] = useState({ department: '', date: '' });
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    fetchApprovedRequests();
  
    fetchLogisticUsers();
    fetchDafUsers();
  }, []);

  useEffect(() => {
    // Update filteredRequests whenever requests or searchParams change
    filterRequests();
  }, [requests, searchParams]);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };

  const fetchDafUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/daf-users`);
      setDafUsers(response.data);
    } catch (error) {
      console.error('Error fetching daf users:', error);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you're storing your JWT token in localStorage
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/approve/approved`, {
        headers: { Authorization: `Bearer ${token}` } // Send token with request
      });
      setRequests(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };
  
 
    
  const filterRequests = () => {
    const { department, date } = searchParams;
    const filtered = requests.filter(request =>
      (!department || request.department.toLowerCase().includes(department.toLowerCase())) &&
      (!date || new Date(request.date).toDateString() === new Date(date).toDateString())
    );
    setFilteredRequests(filtered);
  };

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/approve/${requestId}`);
      setSelectedRequest(response.data);

      // Update the clicked status to true
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/approve/${requestId}`, { clicked: true });

      // Refresh the requests list
      fetchApprovedRequests();
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const handleReceivedClick = async (requestId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/approve/receive/${requestId}`);
      console.log(response.data.message);
      setModalMessage('To Sign reception requisition Successful!!');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      fetchApprovedRequests(); // Refresh the list after reposting
    } catch (error) {
      console.error('Error marking request as received:', error);
   
      setModalMessage('Failed to sign reception requisition');
      setIsSuccess(false); // Set the success state
      setShowModal(true); // Show the modal
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchRequest = (e) => {
    e.preventDefault();
    filterRequests();
  };

  const downloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) {
      console.error('Element with ID pdf-content not found');
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('requisition-form.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="approved-requests-page">
      <h2>Approved Requests</h2>
      <form onSubmit={handleSearchRequest} className="search-form">
        <div className='search-department'>
          <label htmlFor="department">Search by department</label>
          <input
            type="text"
            name="department"
            placeholder="Search by department"
            value={searchParams.department}
            onChange={handleSearchChange}
          />
        </div>

        <div className='search-date'>
          <label htmlFor="date">Search by date</label>
          <input
            type="date"
            name="date"
            placeholder="Search by date"
            value={searchParams.date}
            onChange={handleSearchChange}
          />
        </div>

        <button type="submit" className='search-btn'>Search</button>
      </form>

      <div className="approved-navigate-request">
        <ul>
          {filteredRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from department of <b>{request.department}</b> done on {new Date(request.createdAt).toDateString()}
                <span>{request.clicked ? '' : 'New Request: '}</span>
                <label><FaCheckCircle /> Approved</label>
              </p>
              <button className='mark-received-btn' onClick={() => handleReceivedClick(request._id)}>Mark as Received</button> 
            </li>
          ))}
        </ul>
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

      {selectedRequest && (
        <div className="approved-request-overlay">
          <div className="form-navigation">
            <button className='request-dowload-btn' onClick={downloadPDF}>Download PDF</button>
            <label className='request-cancel-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
          <div className="request-details">
            <div id='pdf-content'>
              <div className="image-request-recieved">
                <img src="/image/logo2.png" alt="Logo" className="logo" />
              </div>
              <div className="request-recieved-heading">
                <h1>WESTERN PROVINCE</h1>
                <h1>DISTRICT: NYABIHU</h1>
                <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
                <h1>DEPARTMENT: {selectedRequest.department}</h1>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Item Name</th>
                    <th>Quantity Requested</th>
                    <th>Quantity Received</th>
                    <th>Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRequest.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.itemName}</td>
                      <td>{item.quantityRequested}</td>
                      <td>{item.quantityReceived}</td>
                      <td>{item.observation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
             
              </div>
              <div className="approved-signature-section">
                <div>
                  <h3>HOD Name:</h3>
                  <label>Prepared By:</label>
                  <p>{selectedRequest.hodName}</p>
                  {selectedRequest.hodSignature ? (
                    <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                  ) : (
                    <p>No HOD signature available</p>
                  )}
                </div>
                <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label>Verified By:</label>
                  {logisticUsers.map(user => (
                    <div key={user._id} className="logistic-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`http://localhost:5000/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="daf-signature">
                  <h3>DAF:</h3>
                  <label>Approved By:</label>
                  {dafUsers.map(user => (
                    <div key={user._id} className="logistic-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`http://localhost:5000/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;
