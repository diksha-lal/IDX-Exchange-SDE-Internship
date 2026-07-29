import { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = (filters = {}) => {
    setLoading(true);
    setError(null);
    fetchProperties({ limit: 20, offset: 0, ...filters })
      .then((data) => {
        setProperties(data.results);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <PropertyFilters onSearch={loadProperties} />
      {loading && <div className="status-message">Loading properties...</div>}
      {error && <div className="status-message error">Error: {error}</div>}
      {!loading && !error && (
        <>
          <p className="results-count">
            Showing {properties.length} of {total} properties
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
        </>
      )}
    </div>
  );
}

export default ListingsPage;