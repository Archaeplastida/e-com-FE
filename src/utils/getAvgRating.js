import { byId } from '../apis/products';

async function getAverageRating(token, product_id) {
    const result = await byId(token, product_id), ratings = result.product.ratings;
    let sum = 0;
    if (ratings && !!ratings.length) {
        ratings.map(rating => sum += rating.rating);
        return { amtOfRaters: ratings.length, avgRating: +(sum / ratings.length).toFixed(1) };
    }
    return false;
}

export default getAverageRating;