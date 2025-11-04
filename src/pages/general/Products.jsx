import React, { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import noProducts from "../../assets/Error.json";
import { FaOpencart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { CartContext } from "../../contexts/CartContext";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/Products/ProductCard";

const Products = () => {
  const { addToCart, updateQuantity, cartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Use the useProducts hook
  const { data: productsData, isLoading, error: queryError } = useProducts();

  useEffect(() => {
    if (productsData) {
      try {
        if (productsData.success) {
          // Filter out combo products (show only regular products)
          const regularProducts = productsData.data.products.filter((item) => item.isCombo !== true);
          setProducts(regularProducts);

          // Initialize quantities
          const initialQuantities = {};
          regularProducts.forEach((item) => {
            const cartItem = cartItems.find((c) => c.id === item.id);
            initialQuantities[item.id] = cartItem ? cartItem.quantity : 1;
          });
          setQuantities(initialQuantities);
        } else {
          setError(productsData.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while processing products.");
      } finally {
        setLoading(false);
      }
    }
  }, [productsData, cartItems]);

  useEffect(() => {
    if (queryError) {
      setError("Something went wrong while fetching products.");
      setLoading(false);
    }
  }, [queryError]);

  useEffect(() => {
    if (!isLoading && productsData) {
      setLoading(false);
    }
  }, [isLoading, productsData]);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const newQty = Math.max(1, value);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));

    const inCart = cartItems.find((c) => c.id === id);
    if (inCart) updateQuantity(id, newQty);
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ ...product, quantity });
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  const gotoProductDetails = (product) => {
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  if (!products.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-5">
        <Lottie animationData={noProducts} loop={true} className="w-72 mb-6" />
        <p className="text-primary font-SpaceGrotesk tracking-wide text-lg font-medium">
          No products found at the moment. <br />
          We're preparing some delicious new items — check back soon!
        </p>
      </div>
    );

  return (
    <section className="p-5 lg:p-10 font-SpaceGrotesk bg-primary/10">
      <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Products;