import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import useFavorites from "./hooks/useFavorites";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-pattern" />
      <svg
        className="hero-houses"
        viewBox="0 0 1440 120"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        style={{ width: "100%", position: "absolute", bottom: 0, left: 0 }}
      >
        <path
          d="M0,80 L60,80 L60,40 L80,20 L100,40 L100,80 L160,80 L160,50 L180,30 L200,50 L200,80 L280,80 L280,45 L310,15 L340,45 L340,80 L420,80 L420,55 L440,35 L460,55 L460,80 L540,80 L540,40 L570,10 L600,40 L600,80 L680,80 L680,50 L700,30 L720,50 L720,80 L800,80 L800,45 L830,15 L860,45 L860,80 L940,80 L940,55 L960,35 L980,55 L980,80 L1060,80 L1060,40 L1090,10 L1120,40 L1120,80 L1200,80 L1200,50 L1220,30 L1240,50 L1240,80 L1320,80 L1320,45 L1350,15 L1380,45 L1380,80 L1440,80 L1440,120 L0,120 Z"
          fill="#fff"
        />
      </svg>
      <div className="hero-content">
        <div className="hero-eyebrow">53,000+ listings across California</div>
        <h1 className="hero-title">
          Find your <span>dream home</span>,<br />just a few clicks away
        </h1>
        <p className="hero-sub">
          Search real MLS listings with photos, maps, and open house schedules
        </p>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">53,122</div>
          <div className="hero-stat-label">Active listings</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">4,282</div>
          <div className="hero-stat-label">Open houses</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">1,000+</div>
          <div className="hero-stat-label">Cities</div>
        </div>
      </div>
    </div>
  );
}

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
        <span className="nav-logo" onClick={() => navigate("/")}>
          🏠 IDX Properties
        </span>
        <div className="nav-right">
          <button
            className="nav-favorites"
            onClick={() => navigate("/favorites")}
          >
            ❤️ Favorites
            {favorites.length > 0 && (
              <span className="favorites-count">{favorites.length}</span>
            )}
          </button>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ListingsPage
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite}
              />
            </>
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
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;