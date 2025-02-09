import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

//Routes and components
import Navbar from './components/Navbar';
import Register from './routes/Register';
import Login from './routes/Login';
import Home from './routes/Home';
import SearchProducts from './routes/SearchProducts';
import TagProducts from './routes/TagProducts';
import ProductPage from './routes/ProductPage';
import ProductCreationForm from './routes/ProductCreationForm';
import ProductEdittingForm from './routes/ProductEdittingForm';
import Cart from './routes/Cart';
import BadRouteHandler from './routes/BadRouteHandler';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/products/id/:product_id/edit" element={<ProductEdittingForm/>}/>
          <Route path="/products/create" element={<ProductCreationForm/>}/>
          <Route path="/products/id/:product_id" element={<ProductPage/>}/>
          <Route path="/products/search/:searchQuery" element={<SearchProducts />} />
          <Route path="/products/:tagName" element={<TagProducts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<BadRouteHandler condition="bad route"/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;