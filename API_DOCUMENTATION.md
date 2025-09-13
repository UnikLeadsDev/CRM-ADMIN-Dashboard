# UniKLeads API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Leads
**GET** `/leads`

Returns all leads in the system.

**Response:**
```json
[
  {
    "Assigned to Lead Employee ID": "EMP001",
    "Customer Name": "John Doe",
    "Mobile Number": "9876543210",
    "Product looking": "Personal Loan",
    "Type of Lead": "Hot Lead",
    "Customer City": "Mumbai",
    "Email ID": "john.doe@email.com",
    "Date": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Get Leads by Employee
**GET** `/leads/employee/:employeeId`

Returns leads assigned to a specific employee.

**Parameters:**
- `employeeId` (string): Employee ID (e.g., "EMP001")

**Response:** Same as above, filtered by employee.

### 3. Upload CSV
**POST** `/leads/upload`

Upload a CSV file to add new leads.

**Request:**
- Content-Type: `multipart/form-data`
- Body: CSV file with columns:
  - Assigned to Lead Employee ID
  - Customer Name
  - Mobile Number
  - Product looking
  - Type of Lead
  - Customer City
  - Email ID

**Response:**
```json
{
  "success": true,
  "processedCount": 3,
  "failedRows": []
}
```

## Environment Variables
Set `VITE_API_URL` in your frontend environment to point to your API:
```
VITE_API_URL=http://your-api-domain.com/api
```