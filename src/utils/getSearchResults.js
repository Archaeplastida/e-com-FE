import { allProducts } from '../apis/products';

async function getSearchResults(token, searchQuery = "") {
    const result = await allProducts(token), listOfAllProducts = result.results, listOfSearchResults = [];
    listOfAllProducts.map(product => { if (product.product_name.toLowerCase().includes(searchQuery.toLowerCase())) listOfSearchResults.push({ id: product.id, product_name: product.product_name, price: product.price, seller_name: product.user_name, images: product.images }) });
    if (!!listOfSearchResults.length) return { amtOfSearchResults: listOfSearchResults.length, searchResults: listOfSearchResults };
    return false;
}
export default getSearchResults;