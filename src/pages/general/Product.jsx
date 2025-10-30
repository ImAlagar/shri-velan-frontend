import React, { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import noProducts from "../../assets/Error.json";
import { FaOpencart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { CartContext } from "../../contexts/CartContext";
import { useProducts } from "../../hooks/useProducts";

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
          <div
            onClick={() => gotoProductDetails(product)}
            key={product.id}
            className="bg-white cursor-pointer text-black p-5 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative group">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-md mb-4 transition-all duration-300 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="bg-primary flex items-center gap-3 font-SpaceGrotesk tracking-wider hover:bg-green-700 text-white p-3 rounded-full shadow-lg"
                >
                  <FaOpencart size={22} /> <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
            {product.weight && <span className="text-sm mb-2">{product.weight}</span>}

            <div className="mb-3">
              <span className="text-primary font-bold mr-2 text-xl">
                ₹{product.offerPrice}
              </span>
              <span className="text-gray-400 line-through text-lg">
                ₹{product.normalPrice}
              </span>
            </div>

            <p
              className={`${
                product.stock > 0 ? "text-green-400" : "text-red-400"
              } font-medium mb-4`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} left)`
                : "Out of Stock"}
            </p>

            {product.stock > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(product.id, quantities[product.id] - 1);
                  }}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-14 text-center border rounded px-1 py-1"
                  value={quantities[product.id]}
                  onChange={(e) =>
                    handleQuantityChange(
                      product.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(product.id, quantities[product.id] + 1);
                  }}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              disabled={product.stock === 0}
              className={`lg:hidden flex px-4 py-2 z-[500] rounded-md justify-center mt-auto font-medium transition-all ${
                product.stock > 0
                  ? "bg-primary hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                gotoProductDetails(product);
              }}
              disabled={product.stock === 0}
              className={`lg:hidden flex px-4 py-2 rounded-md justify-center mt-5 z-0 relative font-medium transition-all ${
                product.stock > 0
                  ? "bg-primary hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              View details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;