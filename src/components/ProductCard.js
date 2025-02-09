import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getAllTags } from '../apis/products';
import getAverageRating from '../utils/getAvgRating';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia'; // Import CardMedia
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const ProductCard = ({ id, product_name, price, seller_name, token, image }) => { // Add image prop

    const [avgRating, setAvgRating] = useState(false);
    const [loadRating, setLoadRating] = useState(true);
    const [errorRating, setErrorRating] = useState(null);

    useEffect(() => {
        getAverageRating(token, id)
        .then(data => {
            if (data) {
                setAvgRating(data);
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
        })
    }, [])

    return (
        <Card sx={{
            maxWidth: 450,
            height: 400, 
            m: 2,
            display: 'flex', // Enable flex layout for vertical arrangement
            flexDirection: 'column' // Stack children vertically
        }}>
            <CardActionArea component={Link} to={`/products/id/${id}`} sx={{
                display: 'flex',
                flexDirection: 'column', // Ensure CardActionArea also stacks vertically
                alignItems: 'stretch', // Stretch items to fill container width
            }}>
                {image && ( // Conditionally render CardMedia if image prop is provided
                    <CardMedia
                        style={{padding: "5px"}}
                        component="img"
                        height="140" // Adjust height as needed
                        image={image} // Use the image prop as the image source
                        alt={product_name} // Good practice to have alt text
                    />
                )}
                <CardContent sx={{ flexGrow: 1 }}> {/* Let CardContent take remaining vertical space */}
                    <Typography gutterBottom variant="h5" component="div">
                        {product_name}
                    </Typography>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Price:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1">
                                ${price}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Seller:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1">
                                {seller_name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Rating:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {loadRating ? (
                                <CircularProgress size={20} />
                            ) : errorRating ? (
                                <Typography variant="body2" color="error">
                                    Error
                                </Typography>
                            ) : avgRating ? (
                                <Box display="flex" alignItems="center">
                                    <Rating
                                        name="read-only"
                                        value={parseFloat(avgRating.avgRating)}
                                        precision={0.5}
                                        readOnly
                                        size="medium"
                                    />
                                    <Typography variant="body2" color="text.secondary" ml={0.5}>
                                        ({avgRating.amtOfRaters})
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Not rated
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ProductCard;