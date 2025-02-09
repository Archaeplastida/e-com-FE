import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { productsByTagId, getAllTags } from '../apis/products';
import ProductCard from "../components/ProductCard";

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const TagProducts = () => {
    const { tagName } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState(null);

    useEffect(() => {
        if (token) {
            setLoadingProducts(true);
            getAllTags(token)
                .then(data => {
                    const checking = [] //We need to verify if this tag exists.
                    data.tags.map(tag => checking.push(tag.tag_name));
                    if (!checking.includes(tagName)) navigate('/'); //We'll go back home if the user tries to access a tag which doesn't exist.
                    data.tags.map(tag => {
                        if (tag.tag_name === tagName) productsByTagId(token, tag.id).then(data => {
                            setProducts(data.products);
                            setLoadingProducts(false);
                        })
                    })
                })
                .catch(error => {
                    console.error("Error fetching:", error);
                    setProductsError(error);
                    setLoadingProducts(false);
                })
        } else {
            setProducts([]);
            setLoadingProducts(false);
        }
    }, [token, tagName]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {token && (
                <Box>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {tagName}
                    </Typography>

                    {loadingProducts ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : productsError ? (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Error loading products. Please try again later.
                        </Alert>
                    ) : products.length > 0 ? (
                        <Grid container spacing={3}>
                            {products.map(product => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}> {/* Responsive grid */}
                                    <ProductCard
                                        id={product.id}
                                        product_name={product.product_name}
                                        price={product.price}
                                        seller_name={product.seller_name}
                                        image={product.images[0]?.image_url}
                                        token={token}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No products found with the tag "{tagName}".
                        </Typography>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default TagProducts;