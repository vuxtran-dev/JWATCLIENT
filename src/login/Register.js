import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8081/auth/register', { username, email, password });
      if (response.status === 200) {
        navigate('/login');  
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data); 
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 4,
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
