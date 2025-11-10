import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

const RelatedProducts = ({ currentProductId, categoryId }) => {
  const navigate = useNavigate();
  const { data: productsData } = useProducts({ category: categoryId });
  
  const relatedProducts = productsData?.data?.products?.filter(
    product => product.id !== currentProductId
  ).slice(0, 4);

  const handleViewDetails = (product) => {
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  if (!relatedProducts?.length) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-bold">
                  ₹{Math.min(product.offerPrice || Infinity, product.normalPrice || Infinity)}
                </span>
                {product.offerPrice && product.normalPrice && product.offerPrice !== product.normalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ₹{Math.max(product.offerPrice, product.normalPrice)}
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleViewDetails(product)}
                className="w-full bg-primary text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;