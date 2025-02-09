import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { byId, rate, deleteProduct } from '../apis/products';
import { addItemToCart, removeItemFromCart, getCart } from '../apis/carts';
import getAverageRating from '../utils/getAvgRating';
import { AuthContext } from '../AuthContext';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Box,
    Rating,
    CircularProgress,
    Alert,
    List,
    ListItem,
    Chip,
    Divider,
    TextField,
    Button,
    Snackbar,
    Dialog, // Import Dialog components
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Edit, Delete, ShoppingCart } from '@mui/icons-material'; // Import Edit and Delete icons
import "./ProductPage.css"
import { checkUserAuth } from '../utils/checkUserAuth';

const ProductPage = () => {
    const { product_id } = useParams();
    const { token } = useContext(AuthContext);
    const [product, setProduct] = useState();
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [errorProduct, setErrorProduct] = useState(null);
    const [avgRating, setAvgRating] = useState(false);
    const [loadRating, setLoadRating] = useState(true);
    const [errorRating, setErrorRating] = useState(null);
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Cart status state - checks if the user has the item in cart
    const [addedToCart, setAddedToCart] = useState(false);
    const [loadCart, setLoadCart] = useState(true);
    const [errorCart, setErrorCart] = useState(null);

    // Rating form states
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorInfoRate, setErrorInfoRate] = useState("");

    // Delete confirmation dialog state
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        if (token) {
            checkUserAuth(token);
            setLoadingProduct(true);
            byId(token, product_id)
                .then(data => {
                    setProduct(data.product);
                    setLoadingProduct(false);

                }
                )
                .catch(error => {
                    console.error("Error fetching:", error);
                    setErrorProduct(error);
                    setLoadingProduct(false);
                    navigate("/");
                }
                );

            getAverageRating(token, product_id)
                .then(data => {
                    if (data) {
                        setAvgRating(data)
                        setLoadRating(false);
                    } else {
                        setAvgRating(false);
                        setLoadRating(false);
                    }
                })
                .catch(error => {
                    console.error("Error fetching:", error);
                    setErrorRating(error);
                    setLoadRating(false);
                }

                )

            getCart(token)
                .then(data => {
                    setLoadCart(true);
                    setAddedToCart(false);
                    if (data.result.length > 0) {
                        data.result.map(item => {
                            if (item.id === product_id) setAddedToCart(true);
                        }
                        )
                    }
                    setLoadCart(false);
                })
                .catch(error => {
                    console.error("Error fetching:", error);
                    setErrorCart(error);
                    setLoadCart(false);
                })
        }
    }, [token, product_id]);

    useEffect(() => {
        if (product) {
            setIsCreator(localStorage.getItem("username") === product.user_name); // Calculate isCreator after product is loaded
        }
    }, [product]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.images.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex < product.images.length - 1 ? prevIndex + 1 : 0));
    };

    const handleRatingChange = (event, newValue) => {
        setUserRating(newValue);
    };

    const handleReviewChange = (event) => {
        setReviewText(event.target.value);
    };

    const handleSubmitRating = () => {
        rate(token, product_id, userRating, reviewText)
            .then(data => {
                setSnackbarOpen(true);
                window.location.reload(); // Consider a better way to refresh ratings
            }).catch(error => {
                console.error("Error submitting rating:", error);
                setErrorInfoRate(error);
                setErrorSnackbarOpen(true);
            })
        setUserRating(0);
        setReviewText('');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'timeout') {
            setSnackbarOpen(false);
        }
    };

    const handleErrorSnackbarClose = (event, reason) => {
        if (reason === 'timeout') {
            setErrorSnackbarOpen(false);
        }
    };

    const handleAddToCart = () => {
        if (addedToCart) {
            removeItemFromCart(token, +product_id);
            setAddedToCart(false);
        } else {
            addItemToCart(token, +product_id);
            setAddedToCart(true);
        }
        //Adds to cart if the user doesn't have it in cart.
        //If the user has the item in cart, then make it remove it.
    }

    const handleOpenDeleteConfirmation = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteProductConfirm = async () => {
        setDeleteLoading(true);
        setDeleteError(null);
        deleteProduct(token, product_id)
            .then(data => {
                setDeleteLoading(false);
                setSnackbarOpen(true);
                navigate("/");
            })
            .catch(error => {
                console.error("Error deleting product:", error);
                setDeleteError(error);
                setDeleteLoading(false);
                setErrorSnackbarOpen(true);
                setErrorInfoRate("Failed to delete product.")
            })
            .finally(() => setDeleteConfirmationOpen(false));
    };


    useEffect(() => {
        if (snackbarOpen) {
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000); // 3 seconds
        }
    }, [snackbarOpen]);

    useEffect(() => {
        if (errorSnackbarOpen) {
            setTimeout(() => {
                setErrorSnackbarOpen(false);
            }, 3000); // 3 seconds
        }
    }, [errorSnackbarOpen]);


    if (!token) {
        return <Alert severity="error">You need to be logged in to view this page.</Alert>;
    }

    if (loadingProduct) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (errorProduct) {
        return (
            <Alert severity="error">Failed to load product. {errorProduct.message}</Alert>
        );
    }

    //const isCreator = localStorage.getItem("username") === product.user_name;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            {product.images && product.images.length > 0 ? (
                                <Box position="relative">
                                    <CardMedia
                                        component="img"
                                        height="400"
                                        image={product.images[currentImageIndex].image_url}
                                        alt={product.product_name}
                                        sx={{ objectFit: 'contain' }}
                                    />
                                    {product.images.length > 1 && (
                                        <>
                                            <IconButton
                                                onClick={handlePrevImage}
                                                sx={{ position: 'absolute', top: '50%', left: 2, transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.7)' }}
                                            >
                                                <ArrowBackIos />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleNextImage}
                                                sx={{ position: 'absolute', top: '50%', right: 2, transform: 'translateY(-50%)', bgcolor: 'rgba(255, 255, 255, 0.7)' }}
                                            >
                                                <ArrowForwardIos />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image="https://via.placeholder.com/400x400?text=No+Image"
                                    alt="No Image"
                                    sx={{ objectFit: 'contain' }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" component="h2" gutterBottom>
                                {product.product_name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Sold by: {product.user_name}
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Rating
                                    value={avgRating ? parseFloat(avgRating.avgRating) : 0}
                                    precision={0.5}
                                    readOnly
                                />
                                <Typography variant="body2" component="span" ml={1} color="text.secondary">
                                    {loadRating ? (
                                        <CircularProgress size="1em" />
                                    ) : errorRating ? (
                                        'Error'
                                    ) : avgRating ? (
                                        `(${avgRating.avgRating} from ${avgRating.amtOfRaters} ratings)`
                                    ) : '(Not rated yet)'}
                                </Typography>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                Price: ${product.price}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {product.product_description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Created at: {new Date(product.created_at).toLocaleString()}
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="subtitle2">Tags:</Typography>
                                {product.tags && product.tags.map((tag) => (
                                    <Chip key={tag.tag_id} label={tag.tag_name} sx={{ mr: 1, mt: 0.5 }} />
                                ))}
                            </Box>
                            <Box mt={2} display="flex" gap={2}>
                                {!loadCart ? (
                                    <>
                                     {addedToCart ? ( // Check if the user already has the item in the cart
                                        <Button
                                            variant="contained"
                                            startIcon={<ShoppingCart />}
                                            onClick={handleAddToCart}
                                        >
                                            Unadd from Cart
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            startIcon={<ShoppingCart />}
                                            onClick={handleAddToCart}
                                        >
                                            Add to Cart
                                        </Button>
    
                                    )}
                                    </>
                                ):(
                                    <p>Loading...</p>
                                )
                            }
                                {isCreator && ( // Conditionally render Edit and Delete buttons for creator
                                    <>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Edit />}
                                            onClick={() => navigate(`/products/id/${product_id}/edit`)} // Navigate to edit page
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={handleOpenDeleteConfirmation} // Open delete confirmation dialog
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                {!isCreator && ( // Conditionally render rating section for non-creators
                    <>
                        <Divider />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Rate this product
                            </Typography>
                            <Box mb={2}>
                                <Rating
                                    name="product-rating"
                                    value={userRating}
                                    precision={1}
                                    onChange={handleRatingChange}
                                />
                            </Box>
                            <TextField
                                label="Your review (optional)"
                                multiline
                                rows={4}
                                fullWidth
                                value={reviewText}
                                onChange={handleReviewChange}
                                margin="normal"
                            />
                            <Box mt={2}>
                                <Button variant="contained" color="primary" onClick={handleSubmitRating}>
                                    Submit Rating
                                </Button>
                            </Box>
                        </CardContent>
                    </>
                )}
                <Divider />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Ratings
                    </Typography>
                    <List>
                        {product.ratings && product.ratings.length > 0 ? (
                            product.ratings.map((rating, index) => (
                                <ListItem key={index} alignItems="flex-start" divider={index < product.ratings.length - 1}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={3}>
                                            <Typography variant="subtitle1">
                                                {rating.user_name}
                                            </Typography>
                                            <Rating name="read-only" value={rating.rating} readOnly />
                                            <Typography variant="caption" color="text.secondary">
                                                Rated on: {new Date(rating.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={9}>
                                            {rating.review_text && (
                                                <Typography variant="body2">
                                                    {rating.review_text}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2">No ratings yet.</Typography>
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmationOpen}
                onClose={handleCloseDeleteConfirmation}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirmation} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteProductConfirm}
                        color="error"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Rating submitted successfully!"
            />
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleErrorSnackbarClose}
                message={`Error: ${errorInfoRate || "Something went wrong."}`}
                severity="error"
            />
        </Container>
    );
};

export default ProductPage;