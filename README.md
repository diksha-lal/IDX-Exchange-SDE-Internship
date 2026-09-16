# IDX Exchange Property Search Application

A Zillow/Redfin-style property search platform built with React, Node.js/Express, and MySQL. Displays 53,000+ real MLS property listings with photos, maps, filters, pagination, and open house data.

![Property Listings](https://via.placeholder.com/800x400?text=Property+Search+App)

## Tech Stack

- **Frontend:** React 18 (Create React App), React Router v6
- **Backend:** Node.js, Express 5
- **Database:** MySQL 8 (Docker)
- **Testing:** Jest, Supertest, React Testing Library
- **Other:** dotenv, cors, mysql2, nodemon

## Local Setup

### Prerequisites
- Node.js (LTS)
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/diksha-lal/IDX-Exchange-SDE-Internship.git
cd IDX-Exchange-SDE-Internship
```

### 2. Start MySQL in Docker
```bash
docker run --name idx-mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=rets -d mysql:8.0
```

### 3. Import the database
```bash
cmd /c "docker exec -i idx-mysql-local mysql -u root -prootpass rets < rets_property.sql"
cmd /c "docker exec -i idx-mysql-local mysql -u root -prootpass rets < rets_openhouse.sql"
```

### 4. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpass
DB_NAME=rets
DB_PORT=3306
PORT=5000

Start the backend:
```bash
npm run dev
```

### 5. Set up the frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

Start the frontend:
```bash
npm start
```

### 6. Open the app
Visit `http://localhost:3000`

## API Reference

### Health Check
GET /api/health

Returns database connection status.

**Response:**
```json
{ "status": "ok", "database": "connected" }
```

---

### Get Properties
GET /api/properties

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Results per page (1-100, default 20) |
| offset | number | Number of results to skip |
| city | string | Filter by city name |
| zipcode | string | Filter by ZIP code |
| minPrice | number | Minimum listing price |
| maxPrice | number | Maximum listing price |
| beds | number | Minimum number of bedrooms |
| baths | number | Minimum number of bathrooms |

**Example:**
GET /api/properties?city=Beverly Hills&minPrice=500000&beds=3&limit=20&offset=0

**Response:**
```json
{
  "total": 87,
  "limit": 20,
  "offset": 0,
  "results": [...]
}
```

---

### Get Property Detail
GET /api/properties/:id

Returns a single property by listing ID.

**Response:** Full property object or 404 if not found.

---

### Get Open Houses
GET /api/properties/:id/openhouses

Returns open house events for a property.

**Response:** Array of open house objects (empty array if none scheduled).

## Database Schema

### rets_property
| Column | Type | Description |
|--------|------|-------------|
| L_ListingID | varchar | Unique listing identifier |
| L_Address | varchar | Street address |
| L_City | varchar | City name |
| L_State | varchar | State code |
| L_Zip | varchar | ZIP code |
| L_SystemPrice | int | Listing price |
| L_Keyword2 | int | Number of bedrooms |
| LM_Dec_3 | decimal | Number of bathrooms |
| LM_Int2_3 | int | Square footage |
| L_Photos | longtext | JSON array of photo URLs |
| LMD_MP_Latitude | decimal | Property latitude |
| LMD_MP_Longitude | decimal | Property longitude |
| L_Remarks | mediumtext | Property description |
| YearBuilt | int | Year property was built |
| LotSizeAcres | decimal | Lot size in acres |

### rets_openhouse
| Column | Type | Description |
|--------|------|-------------|
| L_ListingID | varchar | Foreign key to rets_property |
| OpenHouseDate | date | Date of open house |
| OH_StartTime | time | Start time |
| OH_EndTime | time | End time |
| all_data | longtext | JSON blob with additional fields including OpenHouseRemarks |

**Relationship:** `rets_openhouse.L_ListingID` → `rets_property.L_ListingID`

## Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Known Issues

- `L_Photos` values are not always valid JSON — defensive parsing is applied
- Some properties have missing lat/lon — map conditionally renders
- City names have inconsistent casing — normalized with LOWER(TRIM()) in queries
- `LOWER(TRIM())` on city column prevents index usage — trade-off for data consistency
- Image URLs for sold properties may expire over time

## Future Improvements

- Add sorting by price, date listed, and square footage
- Deploy to cloud (Render + PlanetScale + Vercel)
- Add user authentication and saved searches
- Improve map with property clusters for multiple listings
- Add mortgage calculator to property detail page