import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './configs/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import './ProductDetails.css';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetails() {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducts([{
            id: docSnap.id, // Assuming id is stored in the document
            ...docSnap.data()
          }]);
          setEnlargedImage(docSnap.data().productImage);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      // Update the cart document in the database whenever cart state changes
      const cartDocRef = doc(db, 'cart', 'andrino-cart');
      setDoc(cartDocRef, cart, { merge: true });
    }
  }, [cart]);

  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  const handleAddToCart = async (productId) => {
    const product = products.find((product) => product.id === productId);
    if (product) {
      if (cart[productId]) {
        // If the product already exists in the cart, show a toast and return
        toast.error(`${product.productName} is already in the cart.`);
        return;
      }
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
  };
  
  

  return (
    <>
    <h2 className="card-title1">Product Details</h2>
    <div className="the-container"> {/* Added container div */}
      <div className="details-container mt-5"> {/* Adjusted details-container */}
        {enlargedImage && (
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: 'block' }}
            onClick={() => setEnlargedImage(null)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body" style={{ width: '500px', height: '500px' }}>
                  <img
                    className="img-fluid"
                    src={enlargedImage}
                    alt="Enlarged"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
  
        <div className="details-row">
          {products.map((product, index) => (
            <div className="col-lg-12" key={index}>
              <div className="details-card">
                <div className="card-body">
                  <div className="details-img1">
                    <img
                      className="card-img-top img-fluid"
                      src={product.productImage}
                      alt={product.productName}
                      onClick={() => setEnlargedImage(product.productImage)}
                    />
                  </div>
                  <div className="details-img2">
                    <img
                      className="card-img-top img-fluid"
                      src={product.productImage2}
                      alt={product.productName}
                      onClick={() => setEnlargedImage(product.productImage2)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card">
                  <div className="card-body">
                    <h1 className="card-title">{product.productName}</h1>
                    <p className="card-text">{product.productDescription}</p>
                    <h4 className="card-subtitle mb-2 text-muted">Price: ${product.productPrice}</h4>
                    <button onClick={() => handleAddToCart(product.id)} className="add-to-cart-btn">Add to Cart 🛒</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer position="top-center" />
      </div>
    </div> {/* End of the container */}
  </>  
  );
}

export default ProductDetails;
