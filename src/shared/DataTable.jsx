// components/shared/DataTable.jsx
import React, { useState, useMemo } from 'react';

const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  loading = false,
  emptyMessage = 'No data found',
  className = '',
  rowClassName = '',
  headerClassName = '',
  bodyClassName = '',
  pagination = true,
  pageSize = 5,
  showSizeChanger = true
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * currentPageSize;
    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, pagination]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / currentPageSize);

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex space-x-4">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
        <div className=" transition-all duration-300">
          <table className="w-full">
            <thead className={`bg-gradient-to-r from-gray-50 to-gray-100 ${headerClassName}`}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider transition-all duration-200 ${
                      column.className || ''
                    } ${
                      index > 0 && index < columns.length - 1 ? 'hidden sm:table-cell' : ''
                    } ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.dataIndex)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col space-y-0.5">
                          <span
                            className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400 transition-all duration-200 ${
                              sortConfig.key === column.dataIndex && sortConfig.direction === 'asc'
                                ? 'border-b-blue-600'
                                : ''
                            }`}
                            style={{ fontSize: 0 }}
                          >
                            ▲
                          </span>
                          <span
                            className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400 transition-all duration-200 ${
                              sortConfig.key === column.dataIndex && sortConfig.direction === 'desc'
                                ? 'border-t-blue-600'
                                : ''
                            }`}
                            style={{ fontSize: 0 }}
                          >
                            ▲
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 transition-all duration-300 ${bodyClassName}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 transition-all duration-300">
                      {typeof emptyMessage === 'string' ? (
                        <>
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <div className="text-gray-500 text-sm font-medium">{emptyMessage}</div>
                        </>
                      ) : (
                        emptyMessage
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row[keyField]}
                    className={`hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.002] ${
                      onRowClick ? 'cursor-pointer hover:shadow-sm' : ''
                    } ${rowClassName}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-4 transition-all duration-200 ${
                          column.cellClassName || ''
                        } ${
                          colIndex > 0 && colIndex < columns.length - 1 ? 'hidden sm:table-cell' : ''
                        } ${
                          colIndex === 0 ? 'sm:px-6 font-medium text-gray-900' : 'sm:px-4 text-gray-600'
                        }`}
                      >
                        {column.render ? column.render(row, rowIndex) : row[column.dataIndex]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300">
          <div className="flex items-center space-x-2">
            {showSizeChanger && (
              <>
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={currentPageSize}
                  onChange={(e) => {
                    setCurrentPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(currentPage - 1) * currentPageSize + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(currentPage * currentPageSize, sortedData.length)}
              </span>{' '}
              of <span className="font-semibold">{sortedData.length}</span> entries
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;