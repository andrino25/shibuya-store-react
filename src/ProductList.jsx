import React, { useEffect, useState } from 'react';
import { db } from './configs/firebase'; 
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import './ProductList.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortByPriceAsc]);

  const fetchProducts = async () => {
    try {
      let q = collection(db, 'products');
      if (selectedCategory) {
        q = query(q, where('productCategory', '==', selectedCategory));
      }
      const snapshot = await getDocs(q);
      let productsData = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));

      productsData.sort((a, b) => {
        const priceDifference = a.productPrice - b.productPrice;
        return sortByPriceAsc ? priceDifference : -priceDifference;
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSortToggle = () => {
    setSortByPriceAsc(!sortByPriceAsc);
  };

  const handleAddToCart = async (productId) => {
    const product = products.find((product) => product.id === productId);
    if (product) {
      if (cart[productId]) {
        toast.error(`${product.productName} is already in the cart.`);
      } else {
        toast.success(`${product.productName} has been added to the cart successfully.`);
        setCart(prevCart => {
          const newCart = { ...prevCart };
          newCart[productId] = {
            productName: product.productName,
            quantity: (newCart[productId] ? newCart[productId].quantity : 0) + 1,
            price: product.productPrice,
            imageUrl: product.productImage // Include product image URL
          };
          // Update the existing cart document
          const cartDocRef = doc(db, 'cart', 'andrino-cart');
          setDoc(cartDocRef, newCart, { merge: true });
          
          return newCart;
        });
      }
    }
  };
  
  
  return (
    <div className="container">
  {/* Header */}
  {/* Store image */}
  <div className="row">
    <div className="col">
      <img
        src="https://i.redd.it/jujitsu-kaisen-ultrawide-wallpaper-5120x1440-v0-xz8qmuar9qsa1.png?width=5120&format=png&auto=webp&s=bbd15354e4ccd9790ee8b661b8182a82234e89f1"
        alt="Store Image"
        className="store-image"
      />
    </div>
  </div>
  
  {/* Products */}
  <div className="row">
    <div className="col">
      <h2 className="section-title">Products</h2>
      
      {/* Controls */}
      <div className="controls">
        {/* Category dropdown */}
        <div className="categories">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="btn btn--primary"
          >
            <option value="">All Categories</option>
            <option value="Naruto">Naruto</option>
            <option value="Jujutsu Kaisen">Jujutsu Kaisen</option>
            <option value="Demon Slayer">Demon Slayer</option>
            <option value="Bini">Bini</option>
          </select>
        </div>
        
        {/* Sort toggle button */}
        <div className="sort-toggle">
          <button className="btn" onClick={handleSortToggle}>
            {sortByPriceAsc ? 'Sort by Price: Low to High' : 'Sort by Price: High to Low'}
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="product-list row">
        {products.map((product) => (
          <div key={product.id} className="product-card col">
            <Link to={`/product/${product.id}`}>
              <div className="image-container">
                <img className="img-responsive" src={product.productImage} alt={product.productName} />
                <img className="img-responsive hover-image" src={product.productImage2} alt={product.productName} />
              </div>
              <div className="product-details">
                <h2>{product.productName}</h2>
                <p>{product.productDescription}</p>
                <div className="price-quantity">
                  <p className="price">Price: ${product.productPrice}</p>
                </div>
              </div>
            </Link>
            {/* Centering the Add to Cart button */}
            <div className="controls">
              <button onClick={() => handleAddToCart(product.id)} className="add-to-cart-btn">
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  {/* Add ToastContainer here */}
  <ToastContainer position="top-center" />
</div>

  );
}

export default ProductList;
