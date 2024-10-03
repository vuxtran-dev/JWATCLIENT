import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/auth/login', { username, password });
      if (response.status === 200) {
        console.log('Token:', response.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('token', response.data.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Invalid username or password');
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
          Sign In
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
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
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
