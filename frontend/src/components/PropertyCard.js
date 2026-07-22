function PropertyCard({ property }) {
  let photos = [];
  try {
    photos = JSON.parse(property.L_Photos);
  } catch (e) {
    photos = [];
  }

  const firstPhoto = Array.isArray(photos) && photos.length > 0 ? photos[0] : null;

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return "$" + price.toLocaleString();
  };

  return (
    <div className="property-card">
      <div className="property-card-image">
        {firstPhoto ? (
          <img src={firstPhoto} alt={property.L_Address} />
        ) : (
          <div className="no-photo">No Photo Available</div>
        )}
      </div>
      <div className="property-card-info">
        <div className="property-price">{formatPrice(property.L_SystemPrice)}</div>
        <div className="property-address">{property.L_Address}</div>
        <div className="property-location">{property.L_City}, {property.L_State} {property.L_Zip}</div>
        <div className="property-stats">
          {property.L_Keyword2 != null ? `${property.L_Keyword2} beds` : ""}
          {property.LM_Dec_3 != null ? ` · ${property.LM_Dec_3} baths` : ""}
          {property.LM_Int2_3 != null ? ` · ${property.LM_Int2_3} sqft` : ""}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;