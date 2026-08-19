import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";

function FavoritesPage({ favorites, onFavoriteToggle, isFavorite }) {
  const navigate = useNavigate();

  return (
    <div className="listings-page">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Listings
      </button>
      <h1>Saved Properties</h1>
      <p className="results-count">{favorites.length} saved {favorites.length === 1 ? "property" : "properties"}</p>

      {favorites.length === 0 ? (
        <div className="status-message">No saved properties yet. Click the heart on any listing to save it.</div>
      ) : (
        <div className="property-grid">
          {favorites.map((property) => (
            <PropertyCard
              key={property.L_ListingID}
              property={property}
              onFavoriteToggle={onFavoriteToggle}
              isFavorited={isFavorite(property.L_ListingID)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;