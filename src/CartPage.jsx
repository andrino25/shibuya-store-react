import React, { useEffect, useState } from 'react';
import { db } from './configs/firebase';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'; // Import deleteField function
import './CartPage.css';
import { toast, ToastContainer } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS for react-toastify

function CartPage() {
  const [cart, setCart] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to fetch cart data from Firebase
  const fetchCart = async () => {
    try {
      const cartDocRef = doc(db, 'cart', 'andrino-cart');
      const cartDocSnap = await getDoc(cartDocRef);
      if (cartDocSnap.exists()) {
        setCart(cartDocSnap.data());
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Call fetchCart function when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Function to increase quantity
  const increaseQuantity = async (productId) => {
    try {
      const updatedCart = { ...cart };
      updatedCart[productId].quantity += 1;
      setCart(updatedCart);

      // Update quantity in the database
      const cartDocRef = doc(db, 'cart', 'andrino-cart');
      await updateDoc(cartDocRef, {
        [productId]: {
          ...cart[productId],
          quantity: updatedCart[productId].quantity
        }
      });
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  // Function to decrease quantity
  const decreaseQuantity = async (productId) => {
    try {
      const updatedCart = { ...cart };
      if (updatedCart[productId].quantity > 1) {
        updatedCart[productId].quantity -= 1;
        setCart(updatedCart);

        // Update quantity in the database
        const cartDocRef = doc(db, 'cart', 'andrino-cart');
        await updateDoc(cartDocRef, {
          [productId]: {
            ...cart[productId],
            quantity: updatedCart[productId].quantity
          }
        });
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const onDelete = async (productId) => {
    try {
      // Display a confirmation popup
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      
      // Proceed with deletion if the user confirms
      if (confirmDelete) {
        // Remove the item from the state
        const updatedCart = { ...cart };
        delete updatedCart[productId];
        setCart(updatedCart);
  
        // Remove the item from the database
        const cartDocRef = doc(db, 'cart', 'andrino-cart');
        await updateDoc(cartDocRef, {
          [productId]: deleteField() // Use deleteField function to remove the field
        });
  
        // Display success message as a toast
        toast.success(`Product deleted from cart`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Calculate the total quantity of items in the cart
  useEffect(() => {
    const totalItemsCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(totalItemsCount);
  }, [cart]);

  // Calculate the total price of all items in the cart
  useEffect(() => {
    const totalPriceCount = Object.values(cart).reduce((acc, item) => acc + (item.quantity * item.price), 0);
    setTotalPrice(totalPriceCount);
  }, [cart]);

  return (
    <>
      <div className="row">
        <div className="detials-col">
          <img src="https://i.redd.it/jujitsu-kaisen-ultrawide-wallpaper-5120x1440-v0-xz8qmuar9qsa1.png?width=5120&format=png&auto=webp&s=bbd15354e4ccd9790ee8b661b8182a82234e89f1" alt="Store Image" className="cart-store-image" />
        </div>
      </div>
      <div className="cart-container">
        <div className="cart-title">
          <h2>Your Cart</h2>
        </div>
        <div className="cart-items">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(cart).length > 0 ? (
                Object.keys(cart).map((productId) => (
                  <tr key={productId} className="cart-item">
                    <td>{cart[productId].productName}</td>
                    <td>
                      <img src={cart[productId].imageUrl} alt={cart[productId].productName} className="cart-item-image" />
                    </td>
                    <td>
                      <button className="quantity-buttons" onClick={() => decreaseQuantity(productId)}>-</button> {/* Decrease quantity */}
                      {cart[productId].quantity}
                      <button className="quantity-buttons" onClick={() => increaseQuantity(productId)}>+</button> {/* Increase quantity */}
                    </td>
                    <td>${cart[productId].price}</td>
                    <td>
                      <button className="delete-button" onClick={() => onDelete(productId)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No items in cart</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="checkout-card">
          <h3>Checkout Total</h3>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <button className="checkout-button">Checkout</button>
        </div>
      </div>
      {/* Add ToastContainer here */}
      <ToastContainer position="top-center" />
    </>
  );
}

export default CartPage;
