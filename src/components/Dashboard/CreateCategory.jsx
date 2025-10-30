import React, { useEffect, useState } from "react";
import AuthLoader from "../Auth/AuthLoader";
import Loader from "../Loader/Loader";
import ButtonLoader from "../Loader/ButtonLoader";
import DataTable from "./DataTable";

export default function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const token = sessionStorage.getItem("accessToken");

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(
        "https://shri-velan-food.onrender.com/api/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isActive", isActive);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      let res;
      if (editingId) {
        res = await fetch(
          `https://shri-velan-food.onrender.com/api/categories/${editingId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
        res = await fetch(
          "https://shri-velan-food.onrender.com/api/categories",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }

      const data = await res.json();
      if (!data.success) {
        alert("Error: " + (data.message || "Something went wrong"));
        return;
      }

      await fetchCategories();
      alert(editingId ? "Category updated!" : "Category created!");

      // Reset form
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setEditingId(null);
      setIsActive(true);
    } catch (err) {
      console.error("Error creating/updating category:", err);
      alert("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(
        `https://shri-velan-food.onrender.com/api/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert("Error deleting category: " + (data.message || ""));
        return;
      }
      alert("Category deleted successfully!");
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setPreview(cat.image);
    setImage(null);
    setIsActive(cat.isActive ?? true);
  };

  const categoryColumns = [
    {
      key: 'image',
      header: 'Image',
      render: (image) => (
        <img 
          src={image} 
          alt="Category" 
          className="w-12 h-12 object-cover rounded"
        />
      )
    },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { 
      key: 'isActive', 
      header: 'Status', 
      render: (isActive) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded mt-2 border"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                id="isActive"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Is Active
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? <ButtonLoader /> : editingId ? "Update Category" : "Create Category"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">All Categories</h3>

          {loadingCategories ? (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          ) : (
            <DataTable
              data={categories}
              columns={categoryColumns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              itemsPerPage={8}
            />
          )}
        </div>
      </div>
    </div>
  );
}