import { useState, useEffect } from "react";

function PropertyImageGallery({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setCurrentIndex((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, photos.length]);

  if (!photos || photos.length === 0) {
    return <div className="no-photo gallery-no-photo">No Photos Available</div>;
  }

  return (
    <div className="gallery">
      <div className="gallery-main" onClick={() => setLightboxOpen(true)}>
        <img src={photos[currentIndex]} alt={`Property ${currentIndex + 1}`} />
      </div>
      <div className="gallery-thumbnails">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Thumbnail ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
            <button
              className="lightbox-prev"
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <img src={photos[currentIndex]} alt={`Property ${currentIndex + 1}`} />
            <button
              className="lightbox-next"
              onClick={() => setCurrentIndex((i) => Math.min(i + 1, photos.length - 1))}
              disabled={currentIndex === photos.length - 1}
            >
              ›
            </button>
            <div className="lightbox-counter">{currentIndex + 1} / {photos.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyImageGallery;