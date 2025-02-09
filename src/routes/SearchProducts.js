import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import getSearchResults from '../utils/getSearchResults';
import ProductCard from '../components/ProductCard';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const SearchProducts = () => {
    const { searchQuery } = useParams();
    const { token } = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState(null); // Initialize to null to differentiate "no results" from initial state
    const [loadSearchResults, setLoadSearchResults] = useState(true);
    const [errorSearch, setErrorSearch] = useState(null);


    useEffect(() => {
        if (token) {
            getSearchResults(token, searchQuery)
                .then(data => {
                    if (data) {
                        setSearchResults(data);
                        setLoadSearchResults(false);
                    } else {
                        setSearchResults(null); // Set to null when no results are found
                        setLoadSearchResults(false);
                    }
                })
                .catch(error => {
                    console.error("Error fetching:", error);
                    setErrorSearch(error);
                    setLoadSearchResults(false);
                })
        }

    }, [token, searchQuery])

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Search Results for: "{searchQuery}"
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Displaying products matching the search query: <b>{searchQuery}</b>
                </Typography>

                {loadSearchResults ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : errorSearch ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Error loading search results. Please try again later.
                    </Alert>
                ) : searchResults ? (
                    <Box>
                        {searchResults.amtOfSearchResults > 0 ? (
                            <Typography variant="body1" paragraph>
                                {searchResults.amtOfSearchResults} {searchResults.amtOfSearchResults === 1 ? 'result' : 'results'}
                            </Typography>
                        ) : null} {/* Don't display result count if 0 results */}

                        {searchResults.searchResults.length > 0 ? (
                            <Grid container spacing={3}>
                                {searchResults.searchResults.map(product => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                        <ProductCard
                                            id={product.id}
                                            product_name={product.product_name}
                                            price={product.price}
                                            seller_name={product.seller_name}
                                            token={token}
                                            image={product.images[0]?.image_url}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : null} {/* Grid is only rendered if there are search results */}
                    </Box>
                ) : ( // searchResults is null, meaning no results found
                    <Typography variant="body1" color="text.secondary">
                        No products found for the search query "{searchQuery}".
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default SearchProducts;