import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { byId, getAllTags } from '../apis/products';
import { AuthContext } from '../AuthContext';
import {
    TextField,
    Button,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Container,
    Box,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import { update } from '../apis/products';
import { checkUserAuth } from '../utils/checkUserAuth';

const ProductEdittingForm = () => {
    const { product_id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loadingForm, setLoadingForm] = useState(true);
    const [formData, setFormData] = useState({
        product_name: "",
        product_description: "",
        price: "",
        tags: [],
    });
    const [allTags, setAllTags] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message state

    useEffect(() => {
        if (token) {
            checkUserAuth(token);
            setLoadingForm(true);
            byId(token, product_id)
                .then(data => {
                    if(data.product.user_name !== localStorage.getItem("username")) navigate("/");
                    setFormData({
                        product_name: data.product.product_name,
                        product_description: data.product.product_description,
                        price: data.product.price.toString(),
                        tags: [],
                    });
                    setCheckedTags(data.product.tags.map(tag => tag.id));
                })
                .then(() => {
                    return getAllTags(token);
                })
                .then(data => {
                    setAllTags(data.tags);
                    setLoadingForm(false);
                })
                .catch(error => {
                    console.error("Error fetching product or tags:", error);
                    setLoadingForm(false);
                    navigate("/");
                });
        }
    }, [token, product_id]);

    useEffect(() => {
        validateForm();
    }, [formData, checkedTags]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagChange = (e) => {
        const tagId = parseInt(e.target.value);
        if (e.target.checked) {
            setCheckedTags([...checkedTags, tagId]);
        } else {
            setCheckedTags(checkedTags.filter(id => id !== tagId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setSnackbarOpen(true); // Snackbar will already be showing message from validateForm
            return;
        }
        const submissionData = {
            ...formData,
            price: parseFloat(formData.price),
            tags: checkedTags,
        };

        let newTagObjArr = [];

        submissionData.tags.map(tag => newTagObjArr.push({tag_id: tag}));

        update(
            token, 
            submissionData.product_name,
            submissionData.product_description,
            submissionData.price,
            newTagObjArr,
            product_id
        ).then(() => {
            navigate(`/products/id/${product_id}`);
        })
    };

    const validateForm = () => {
        const { product_name, product_description, price } = formData;
        let isValid = true;
        let messages = []; // Array to hold error messages

        if (!product_name.trim()) {
            isValid = false;
            messages.push("Product name is required.");
        }

        if (!product_description.trim()) {
            isValid = false;
            messages.push("Product description is required.");
        }

        if (!price.trim()) {
            isValid = false;
            messages.push("Price is required.");
        } else {
            const priceValue = parseFloat(price);
            if (isNaN(priceValue) || priceValue < 0) {
                isValid = false;
                messages.push("Price must be a non-negative number.");
            } else {
                const priceStr = price.toString();
                if (priceStr.includes('.')) {
                    const decimalPart = priceStr.split('.')[1];
                    if (decimalPart && decimalPart.length > 2) {
                        isValid = false;
                        messages.push("Price precision can be at most 2 decimal places.");
                    }
                }
            }
        }

        if (checkedTags.length === 0) {
            isValid = false;
            messages.push("At least one tag is required.");
        }

        setIsFormValid(isValid);
        if (!isValid) {
            setSnackbarMessage(messages.join(' ')); // Join messages for Snackbar
        } else {
            setSnackbarMessage(''); // Clear message if valid
            setSnackbarOpen(false); // Ensure Snackbar is closed if form becomes valid after being invalid
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    if (loadingForm) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h4" component="h2">
                    Edit Product
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="product_name"
                    name="product_name"
                    label="Product Name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    id="product_description"
                    name="product_description"
                    label="Product Description"
                    multiline
                    rows={4}
                    value={formData.product_description}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    id="price"
                    name="price"
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <FormControl component="fieldset" margin="normal" fullWidth>
                    <FormLabel component="legend">Tags</FormLabel>
                    <FormGroup>
                        {allTags.map((tag) => (
                            <FormControlLabel
                                key={tag.id}
                                control={
                                    <Checkbox
                                        checked={checkedTags.includes(tag.id)}
                                        onChange={handleTagChange}
                                        name={`tag-${tag.id}`}
                                        value={tag.id.toString()}
                                    />
                                }
                                label={tag.tag_name}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
                        Save Changes
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        sx={{ ml: 2 }}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductEdittingForm;