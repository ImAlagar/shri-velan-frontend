import React from 'react';
import { FiX, FiUpload } from 'react-icons/fi';

const ImageUpload = ({
  label,
  existingImages = [],
  filePreviews = [],
  onFileChange,
  onRemoveExisting,
  onRemovePreview,
  multiple = true,
  className = ''
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFileChange(files);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div>
        <label className="font-medium text-gray-700 mb-2 text-sm block">
          {label}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-600 font-medium">Click to upload images</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG up to 10MB</p>
          </label>
        </div>
      </div>

      {/* Image Previews */}
      {(existingImages.length > 0 || filePreviews.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Existing Images */}
          {existingImages.map((img, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img
                src={img}
                alt={`Existing ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}

          {/* New File Previews */}
          {filePreviews.map((src, index) => (
            <div key={`preview-${index}`} className="relative group">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => onRemovePreview(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;