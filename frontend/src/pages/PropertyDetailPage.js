import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchPropertyDetail(id), fetchOpenHouses(id)])
      .then(([propertyData, openHouseData]) => {
        setProperty(propertyData);
        setOpenHouses(openHouseData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="status-message">Loading property...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;
  if (!property) return <div className="status-message">Property not found.</div>;

  let photos = [];
  try {
    photos = JSON.parse(property.L_Photos);
    if (!Array.isArray(photos)) photos = [];
  } catch (e) {
    photos = [];
  }

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return "$" + price.toLocaleString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back to Listings</button>

      <PropertyImageGallery photos={photos} />

      <div className="detail-content">
        <div className="detail-header">
          <h1 className="detail-price">{formatPrice(property.L_SystemPrice)}</h1>
          <h2 className="detail-address">{property.L_Address}</h2>
          <p className="detail-location">{property.L_City}, {property.L_State} {property.L_Zip}</p>
        </div>

        <div className="detail-stats">
          {property.L_Keyword2 != null && <div className="stat"><span>{property.L_Keyword2}</span> beds</div>}
          {property.LM_Dec_3 != null && <div className="stat"><span>{property.LM_Dec_3}</span> baths</div>}
          {property.LM_Int2_3 != null && <div className="stat"><span>{property.LM_Int2_3}</span> sqft</div>}
          {property.YearBuilt != null && <div className="stat">Built <span>{property.YearBuilt}</span></div>}
          {property.LotSizeAcres != null && <div className="stat"><span>{property.LotSizeAcres}</span> acres</div>}
        </div>

        {property.L_Remarks && (
          <div className="detail-section">
            <h3>Description</h3>
            <p>{property.L_Remarks}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Property Details</h3>
          <div className="detail-grid">
            {property.L_Type_ && <div><strong>Type:</strong> {property.L_Type_}</div>}
            {property.L_Status && <div><strong>Status:</strong> {property.L_Status}</div>}
            {property.YearBuilt && <div><strong>Year Built:</strong> {property.YearBuilt}</div>}
            {property.LM_Int2_3 && <div><strong>Sqft:</strong> {property.LM_Int2_3}</div>}
            {property.LotSizeAcres && <div><strong>Lot Size:</strong> {property.LotSizeAcres} acres</div>}
            {property.CountyOrParish && <div><strong>County:</strong> {property.CountyOrParish}</div>}
          </div>
        </div>

        <PropertyMap
          lat={property.LMD_MP_Latitude}
          lng={property.LMD_MP_Longitude}
          address={property.L_Address}
        />

        <div className="detail-section">
          <h3>Open Houses</h3>
          {openHouses.length === 0 ? (
            <p>No open houses scheduled.</p>
          ) : (
            <div className="open-houses">
              {openHouses.map((oh) => {
                let remarks = "";
                try {
                  const allData = JSON.parse(oh.all_data);
                  remarks = allData.OpenHouseRemarks || "";
                } catch (e) {
                  remarks = "";
                }

                return (
                  <div key={oh.id} className="open-house-item">
                    <div className="open-house-date">{formatDate(oh.OpenHouseDate)}</div>
                    <div className="open-house-time">
                      {formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}
                    </div>
                    {remarks && <div className="open-house-remarks">{remarks}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;