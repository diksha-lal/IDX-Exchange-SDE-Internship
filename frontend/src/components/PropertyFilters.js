import { useState } from "react";

function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") activeFilters[key] = value;
    });
    onSearch(activeFilters);
  };

  const handleClear = () => {
    setFilters({
      city: "",
      zipcode: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      baths: "",
    });
    onSearch({});
  };

  return (
    <div className="filters">
      <input
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />
      <input
        name="zipcode"
        placeholder="ZIP Code"
        value={filters.zipcode}
        onChange={handleChange}
      />
      <input
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Any Beds</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>
      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Any Baths</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear Filters</button>
    </div>
  );
}

export default PropertyFilters;