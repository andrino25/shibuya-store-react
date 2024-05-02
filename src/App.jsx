import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import CartPage from './CartPage'; // Import the CartPage component
import { db } from './configs/firebase';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

function App() {
  const [cart, setCart] = useState({});
  const listCollection = collection(db, 'cart')

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartDocRef = doc(db, 'cart', 'andrino-cart');
        const cartDocSnapshot = await getDoc(cartDocRef);
        if (cartDocSnapshot.exists) {
          setCart(cartDocSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    // Fetch cart data initially
    fetchCart();

    // Set up a real-time listener for changes in the cart data
    const unsubscribe = onSnapshot(doc(db, 'cart', 'andrino-cart'), (doc) => {
      if (doc.exists) {
        setCart(doc.data());
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Update the cart count in Firebase whenever the cart state changes
  useEffect(() => {
    if (cart && Object.values(cart).length > 0) {
      setDoc(doc(db, 'cart', 'andrino-cart'), {
        ...cart,
      });
    }
  }, [cart]);

  return (
    <BrowserRouter>
      <div className="header">
        <Link to="/" ><h2 className="title">Shibuya Store</h2></Link>
        {/* Link to the /cart route */}
        <Link to="/cart" className= "cartIcon">🛒 ({Object.values(cart).reduce((acc, item) => acc + item.quantity, 0)})</Link>
      </div>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} /> {/* Add the route for the cart page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;