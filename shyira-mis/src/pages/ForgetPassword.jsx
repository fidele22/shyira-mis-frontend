import { useState } from 'react';
import axios from 'axios';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, { email });
      setMessage(response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset link.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="forget-password-container">
      <h1>Forgot Password</h1>
      <label htmlFor="">Enter your login email address to recieve password reset link</label>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Get Reset Link</button>
      </form>
      {message && (
       
          <div className="modal-content">
            {isSuccess ? (
              <div className="modal-success">
                <FaCheckCircle size={54} color="green" />
                <p color='green'>{message}</p>
              </div>
            ) : (
              <div className="modal-error">
                <FaTimesCircle size={54} color="red" />
                <p color='red'> {message}</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
    
      )}
      {message && <p></p>}
    </div>
  );
};

export default ForgotPassword;
