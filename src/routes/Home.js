import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, Box, Paper } from '@mui/material';
import './Home.css';

const Home = () => {
  const { token, logout, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" className="home-container">
      <Box className="home-content">
        <Typography variant="h3" component="h1" className="home-title">
          Welcome to E-com
        </Typography>

        {token ? (
          <Paper elevation={3} className="home-card">
            <Typography variant="h5" component="h2" gutterBottom>
              Hello, {username}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              You are logged in and can access all features.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              className="home-button"
            >
              Logout
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} className="home-card">
            <Typography variant="h5" component="h2" gutterBottom>
              Please Login
            </Typography>
            <Typography variant="body1" gutterBottom>
              You need to log in to view this page.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              className="home-button"
            >
              Go to Login
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Home;