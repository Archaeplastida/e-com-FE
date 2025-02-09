import React, { useContext, useEffect, useState } from 'react';
import { getCart, removeItemFromCart } from '../apis/carts';
import { byId } from '../apis/products';
import { AuthContext } from '../AuthContext';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Box,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
    const { token } = useContext(AuthContext);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cart, setCart] = useState([])
    const [errorCart, setErrorCart] = useState(null);

    const fetchCart = () => {
        if (token) {
            setLoadingCart(true);
            getCart(token)
                .then(data => {
                    setCart(data.result)
                    setLoadingCart(false);
                })
                .catch(error => {
                    console.error(`Error loading cart: ${error}`);
                    setErrorCart(error);
                    setLoadingCart(false);
                })
        } else {
            setLoadingCart(false); // If no token, not loading, but also no cart
        }
    }

    useEffect(() => {
        fetchCart();
    }, [token]);

    const handleRemoveItem = (productId) => {
        if (token) {
            removeItemFromCart(token, productId)
                .then(() => {
                    // Optimistically update the cart by filtering out the removed item
                    setCart(cart.filter(item => item.id !== productId));
                })
                .catch(error => {
                    console.error(`Error removing item from cart: ${error}`);
                    setErrorCart(error);
                });
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    if (loadingCart) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (errorCart) {
        return (
            <Container>
                <Alert severity="error">Error loading cart: {errorCart.message}</Alert>
            </Container>
        );
    }

    if (!token) {
        return (
            <Container>
                <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: '2rem' }}>
                    Please log in to view your cart.
                </Typography>
            </Container>
        );
    }

    if (cart.length === 0) {
        return (
            <Container>
                <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: '2rem' }}>
                    Your cart is empty.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>
            <List>
                {cart.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={item.product_name}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Price: ${item.price}
                                        </Typography>
                                        {` — ${item.product_description}`}
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index !== cart.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
            <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                    Total: ${calculateTotalPrice()}
                </Typography>
                <Button variant="contained" color="primary">
                    Checkout
                </Button>
            </Box>
        </Container>
    );
};

export default Cart;