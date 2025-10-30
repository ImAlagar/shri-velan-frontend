import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import DataTable from "./DataTable";

export default function AllProducts({ setActiveTab }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => sessionStorage.getItem("accessToken");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch("https://shri-velan-food.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data?.data?.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = getToken();
      if (!token) return alert("No authorization token found.");

      const response = await fetch(`https://shri-velan-food.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete product");
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setActiveTab("Add Products", { product, isEditing: true });
  };

  const productColumns = [
    {
      key: 'images',
      header: 'Image',
      render: (images) => (
        <img 
          src={images?.[0]} 
          alt="Product" 
          className="w-12 h-12 object-cover rounded"
        />
      )
    },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category', render: (category) => category?.name || 'N/A' },
    { key: 'weight', header: 'Weight' },
    { 
      key: 'normalPrice', 
      header: 'Normal Price', 
      render: (price) => `₹${price}` 
    },
    { 
      key: 'offerPrice', 
      header: 'Offer Price', 
      render: (price) => `₹${price}` 
    },
    { key: 'stock', header: 'Stock' },
    { 
      key: 'status', 
      header: 'Status', 
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-96"><Loader /></div>;
  if (error) return <p className="text-center text-red-500 mt-5">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <p className="text-gray-600">Manage and view all your products</p>
        </div>
        <button
          onClick={() => setActiveTab("Add Products")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      <DataTable
        data={products}
        columns={productColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemsPerPage={10}
      />
    </div>
  );
}