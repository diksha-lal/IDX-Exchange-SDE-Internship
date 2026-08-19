import { useState, useEffect } from "react";

function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (property) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.L_ListingID === property.L_ListingID)) return prev;
      return [...prev, property];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.L_ListingID !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((p) => p.L_ListingID === id);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

export default useFavorites;