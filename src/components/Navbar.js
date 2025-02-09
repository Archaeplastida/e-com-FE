import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getAllTags } from '../apis/products';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Container, useTheme } from '@mui/material';
import './Navbar.css'; // Import Navbar.css

const Navbar = () => {
  const { token, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [tagsError, setTagsError] = useState(null);
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    let searchTerm = event.target.search.value;
    searchTerm = searchTerm.trim();
    if (searchTerm.length > 0) navigate(`/products/search/${searchTerm}`);
  };

  useEffect(() => {
    if (token) {
      setLoadingTags(true);
      getAllTags(token)
        .then(data => {
          setTags(data.tags);
          setLoadingTags(false);
        })
        .catch(error => {
          setTagsError(error);
          setLoadingTags(false);
        });
    } else {
      setTags([]);
      setLoadingTags(false);
    }
  }, [token]);

  return (
    <>
      {/* Top Navbar (Always Visible) */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography variant="h4" component="div" className="navbar-brand">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Nile</Link> {/* Removed inline style here */}
          </Typography>
          {token ? (
            <>
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="search"
                  placeholder="Search products..."
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
                <Button type="submit" variant="contained" className="button-secondary">
                  Search
                </Button>
              </Box>
              <Button color="inherit" component={Link} to="/products/create">Create</Button>
              <Typography variant="body1" sx={{ mx: 2 }}>Welcome, {username}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Bottom Navbar (Conditional - Logged In) */}
      {token && (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark }}>
          <Toolbar>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {loadingTags ? (
                  <Typography>Loading tags...</Typography>
                ) : tagsError ? (
                  <Typography>Error loading tags.</Typography>
                ) : (
                  tags.map(tag => (
                    <Button key={tag.id} color="inherit" className="link-secondary" component={Link} to={`/products/${tag.tag_name}`}>
                      {tag.tag_name}
                    </Button>
                  ))
                )}
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Navbar;