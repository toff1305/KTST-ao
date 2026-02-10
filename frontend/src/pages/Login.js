import React, { useState } from 'react';
// Importing images from the components folder
import logo from '../components/logo.png';
// NOTE: Ensure the extension is correct (.png or .jpg) based on your actual file
import bgImage from '../components/background-login.png'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For prototype purposes, we just trigger the login callback
    onLogin();
  };

  return (
    <div style={styles.container}>
      {/* Semi-transparent overlay to make text readable over the background image */}
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="KTST Logo" style={styles.logo} />
        </div>

        <h1 style={styles.title}>KTST Microfinancing Inc.</h1>
        <h2 style={styles.subtitle}>Welcome Back!</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter username"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" style={styles.button}>LOGIN</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    height: '100vh', 
    width: '100%',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'Arial, sans-serif'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Light overlay to match the clean PDF look
    zIndex: 1
  },
  content: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '350px',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logoContainer: {
    width: '120px',
    height: '120px',
    marginBottom: '20px',
    // Optional: add a white circle background if the logo needs it
    // backgroundColor: '#fff',
    // borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  title: {
    color: '#1a237e', // Dark Blue
    fontSize: '1.4rem',
    margin: '10px 0',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: '30px',
    fontWeight: 'normal'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9', // Slightly grey input background
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '25px',
    backgroundColor: '#0c0c3a', // Dark Navy Blue
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
  }
};

export default Login;