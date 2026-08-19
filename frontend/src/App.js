import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import useFavorites from "./hooks/useFavorites";
import "./App.css";

function AppContent() {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteToggle = (property) => {
    if (isFavorite(property.L_ListingID)) {
      removeFavorite(property.L_ListingID);
    } else {
      addFavorite(property);
    }
  };

  return (
    <>
      <nav className="navbar">
        <span className="nav-logo" onClick={() => navigate("/")}>🏠 IDX Properties</span>
        <button className="nav-favorites" onClick={() => navigate("/favorites")}>
          ❤️ Favorites {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
        </button>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <ListingsPage
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={isFavorite}
            />
          }
        />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={isFavorite}
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;