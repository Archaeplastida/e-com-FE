import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getAllTags, create } from '../apis/products';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl,
    FormLabel,
    FormHelperText,
    ImageList,
    ImageListItem,
    IconButton,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductCreationForm = () => {
    const [loadingForm, setLoadingForm] = useState(true);
    const [errorForm, setErrorForm] = useState(null);
    const [retrieveTags, setRetrieveTags] = useState([]);
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        product_name: "",
        product_description: "",
        price: "", // Price is now a string
        tags: [],
        images: [""]
    });
    const [tagError, setTagError] = useState(false);
    const [imageErrors, setImageErrors] = useState([""]);
    const [imagePreviews, setImagePreviews] = useState([""]);
    const [formError, setFormError] = useState(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isImageValidating, setIsImageValidating] = useState(false);
    const [priceError, setPriceError] = useState(""); // State for price error message
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setLoadingForm(true);
            getAllTags(token)
                .then(data => {
                    setRetrieveTags(data.tags);
                    setLoadingForm(false);
                }).catch(error => {
                    console.error("Error fetching tags:", error);
                    setErrorForm(error);
                    setLoadingForm(false);
                })
        } else {
            setRetrieveTags([])
            setLoadingForm(false);
        }
    }, [token]);

    useEffect(() => {
        checkFormValidity();
    }, [imageErrors, formData, isImageValidating, tagError, priceError]); // Include priceError in dependency

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'price') {
            setPriceError(""); // Clear price error on typing
        }
    };

    const handleTagChange = (e) => {
        setTagError(false);
        const tagValue = parseInt(e.target.value);
        let updatedTags = [...formData.tags];
        if (e.target.checked) {
            updatedTags.push(tagValue);
        } else {
            updatedTags = updatedTags.filter(tag => tag !== tagValue);
        }
        setFormData({ ...formData, tags: updatedTags });
    };

    const handleImageChange = (e, index) => {
        const newImages = [...formData.images];
        newImages[index] = e.target.value;
        setFormData({ ...formData, images: newImages });
        updateImagePreview(e.target.value, index);
        const newImageErrors = [...imageErrors];
        newImageErrors[index] = "";
        setImageErrors(newImageErrors);
        checkFormValidity();
    };

    const updateImagePreview = (url, index) => {
        const newImagePreviews = [...imagePreviews];
        const newImageErrors = [...imageErrors];
        newImagePreviews[index] = url;
        newImageErrors[index] = "";
        setImagePreviews(newImagePreviews);
        setImageErrors(newImageErrors);
        setIsImageValidating(true);
        checkFormValidity();
    };

    const handleImageLoad = () => {
        setIsImageValidating(false);
        checkFormValidity();
    };


    const handleImageError = (index) => {
        const newImageErrors = [...imageErrors];
        newImageErrors[index] = "Invalid image URL";
        setImageErrors(newImageErrors);
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[index] = "";
        setImagePreviews(newImagePreviews);
        setIsImageValidating(false);
        checkFormValidity();
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
        setImagePreviews([...imagePreviews, ""]);
        setImageErrors([...imageErrors, ""]);
        checkFormValidity();
    };

    const removeImageField = (index) => {
        if (formData.images.length <= 1) {
            alert("At least one image is required.");
            return;
        }
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newImagePreviews);
        const newImageErrors = imageErrors.filter((_, i) => i !== index);
        setImageErrors(newImageErrors);
        checkFormValidity();
    };

    const checkFormValidity = () => {
        if (isImageValidating) {
            setIsSubmitDisabled(true);
            return;
        }

        const hasEmptyTextField = !formData.product_name || !formData.product_description || !formData.price;
        const hasNoTags = formData.tags.length === 0;
        let hasImageError = false;
        let hasEmptyImageField = false;
        let isPriceValid = true;

        formData.images.forEach((imageUrl, index) => {
            if (imageUrl && imageErrors[index]) {
                hasImageError = true;
            } else if (!imageUrl) {
                hasEmptyImageField = true;
            }
        });

        // Price validation
        const priceValue = formData.price;
        if (priceValue) {
            const regex = /^\d+(\.\d{0,2})?$/; // Regex for numbers with up to 2 decimal places
            if (!regex.test(priceValue)) {
                isPriceValid = false;
                setPriceError("Invalid price format. Max 2 decimals.");
            } else if (parseFloat(priceValue) <= 0) {
                isPriceValid = false;
                setPriceError("Price must be greater than 0.");
            } else {
                setPriceError(""); // Clear error if valid
            }
        } else {
            isPriceValid = false; // Price is empty
        }


        const isFormInvalid = hasEmptyTextField || hasNoTags || hasImageError || (formData.images.length > 0 && hasEmptyImageField) || !isPriceValid;

        setIsSubmitDisabled(isFormInvalid);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitDisabled) {
            alert("Please fill out all required fields and ensure image URLs and price are valid.");
            return;
        }
        setFormError(null);


        let hasEmptyImageFields = false;
        const newImageErrors = [...imageErrors];

        formData.images.forEach((imageUrl, index) => {
            if (!imageUrl) {
                newImageErrors[index] = "Image URL is required";
                hasEmptyImageFields = true;
            }
        });
        setImageErrors(newImageErrors);

        if (hasEmptyImageFields) {
            setFormError("Please fill in all image URLs.");
            return;
        }

        let hasImageErrorOnSubmit = false;
        for (let error of imageErrors) {
            if (error) {
                hasImageErrorOnSubmit = true;
                break;
            }
        }
        if (hasImageErrorOnSubmit) {
            setFormError("Please fix invalid image URLs.");
            return;
        }


        if (formData.tags.length === 0) {
            setTagError(true);
            return;
        }

        const validImages = formData.images.filter((url, index) => url && !imageErrors[index]);
        if (validImages.length === 0) {
            alert("At least one valid image URL is required.");
            return;
        }

        let imageObjArr = [], tagObjArr = [];

        formData.images.map(image => imageObjArr.push({ image_url: image }));
        formData.tags.map(tag => tagObjArr.push({ tag_id: tag }));

        create(
            token,
            formData.product_name,
            formData.product_description,
            +formData.price,
            tagObjArr,
            imageObjArr
        ).then(data => navigate(`/products/id/${data.created.id}`));
    };

    if (loadingForm) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (errorForm) {
        return (
            <Container maxWidth="md">
                <Alert severity="error">
                    Error loading form data. Please try again later.
                </Alert>
            </Container>
        );
    }

    if (!token) {
        return (
            <Container maxWidth="md">
                <Alert severity="warning">
                    Please log in to create a product.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                Create New Product
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {formError && (
                        <Grid item xs={12}>
                            <Alert severity="error">{formError}</Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="product_name"
                            variant="outlined"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Description"
                            name="product_description"
                            variant="outlined"
                            multiline
                            rows={4}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="text"
                            variant="outlined"
                            onChange={handleChange}
                            required
                            error={!!priceError}
                            helperText={priceError}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl required error={tagError} component="fieldset">
                            <FormLabel component="legend">Tags</FormLabel>
                            <FormGroup>
                                {retrieveTags.map((tag) => (
                                    <FormControlLabel
                                        key={tag.id}
                                        control={<Checkbox value={tag.id} onChange={handleTagChange} />}
                                        label={tag.tag_name}
                                    />
                                ))}
                            </FormGroup>
                            {tagError && <FormHelperText>At least one tag is required!</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Images</FormLabel>
                            {formData.images.map((imageUrl, index) => (
                                <Box key={index} mb={2} display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        label={`Image URL ${index + 1}`}
                                        variant="outlined"
                                        value={imageUrl}
                                        onChange={(e) => handleImageChange(e, index)}
                                        error={!!imageErrors[index]}
                                        helperText={imageErrors[index]}
                                        required={formData.images.length <= 1 && index === 0}
                                    />
                                    {formData.images.length > 1 && (
                                        <IconButton aria-label="delete image" onClick={() => removeImageField(index)} sx={{ ml: 1 }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={addImageField}>Add Image</Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <ImageList rowHeight={250} cols={formData.images.length || 1} gap={8}>
                            {imagePreviews.map((previewUrl, index) => (
                                previewUrl && <ImageListItem key={index} style={{ height: 250, overflow: 'hidden' }}>
                                    <img
                                        src={previewUrl}
                                        alt={`Product Image ${index + 1}`}
                                        loading="lazy"
                                        onLoad={handleImageLoad}
                                        onError={() => handleImageError(index)}
                                        style={{
                                            height: '100%',
                                            width: 'auto',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled}>
                            Create Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default ProductCreationForm;