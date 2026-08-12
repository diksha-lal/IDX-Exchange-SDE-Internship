import { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const itemsPerPage = 20;

  const loadProperties = (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);
    const offset = (page - 1) * itemsPerPage;
    fetchProperties({ limit: itemsPerPage, offset, ...filters })
      .then((data) => {
        setProperties(data.results);
        setTotal(data.total);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSearch = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadProperties(filters, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProperties(activeFilters, page);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startResult = (currentPage - 1) * itemsPerPage + 1;
  const endResult = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <PropertyFilters onSearch={handleSearch} />
      {loading && <div className="status-message">Loading properties...</div>}
      {error && <div className="status-message error">Error: {error}</div>}
      {!loading && !error && (
        <>
          <p className="results-count">
            Showing {startResult}-{endResult} of {total} properties
          </p>
          {properties.length === 0 ? (
            <div className="status-message">No properties found.</div>
          ) : (
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard key={property.L_ListingID} property={property} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ListingsPage;