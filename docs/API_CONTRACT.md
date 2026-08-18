# API CONTRACT (VERIFIKASI SOAL)

## Version: v1
## Base URL: `/api/v1`
## Authentication: Laravel Sanctum (`Bearer Token`)

---

## 1. Authentication
All endpoints except `/login` require a Bearer token.

### 1.1 Login
- **Method:** `POST`
- **URI:** `/login`
- **Authorization:** Public
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
- **Validation Rules:** Valid email and string password.
- **Success Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "SUPER_ADMIN"
    },
    "token": "1|abcdef123456..."
  }
}
```
- **Error Responses:**
  - `422 Unprocessable Entity`: Validation failure or incorrect credentials.

### 1.2 Get Authenticated User
- **Method:** `GET`
- **URI:** `/me`
- **Authorization:** Any authenticated user
- **Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "SUPER_ADMIN"
  }
}
```

### 1.3 Logout
- **Method:** `POST`
- **URI:** `/logout`
- **Authorization:** Any authenticated user
- **Success Response (200):**
```json
{
  "message": "Logged out successfully."
}
```
*Note: This only revokes the current token.*

---

## 2. Master Data (Read-Only)
Master data endpoints are completely read-only and available to all authenticated users.

### 1.1 List Dosens
- **Method:** `GET`
- **URI:** `/dosens`
- **Authorization:** Any authenticated user
- **Query Parameters:**
  - `page` (integer): Page number for pagination
  - `per_page` (integer): Items per page (default: 15)
  - `with_user` (boolean): Include linked `user` account object
- **Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "kode_dosen": "D01",
      "nama": "Dr. Dosen",
      "jfa": "Lektor",
      "no_hp": "08123456789",
      "user": null
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### 1.2 Detail Dosen
- **Method:** `GET`
- **URI:** `/dosens/{id}`
- **Authorization:** Any authenticated user
- **Success Response (200):** Same format as single object in 1.1 List
- **Error Response (404):** `{"message": "Resource not found."}`

### 1.3 List Courses
- **Method:** `GET`
- **URI:** `/courses`
- **Authorization:** Any authenticated user
- **Query Parameters:**
  - `with_clos` (boolean): Include nested CLOs and PLOs.
- **Success Response (200):** Paginated list of courses.

### 1.4 List Academic Periods (Semesters)
- **Method:** `GET`
- **URI:** `/semesters`
- **Authorization:** Any authenticated user
- **Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "code": "GANJIL_24_25",
      "name": "Ganjil 24/25",
      "start_date": null,
      "end_date": null,
      "is_active": false
    }
  ]
}
```

### 1.5 List PLOs & CLOs
- **GET** `/plos` (Paginated)
- **GET** `/clos` (Paginated, optional `with_plos=1`)

---

## 2. Assignments (Mutations)
Assignments define the business roles (Koordinator/Verifikator) per period. 
Mutations require `SUPER_ADMIN` privileges.

### 2.1 List Koordinator Assignments
- **Method:** `GET`
- **URI:** `/koordinator-assignments`
- **Authorization:** Any authenticated user
- **Success Response (200):** Paginated list with eager-loaded `course`, `semester`, and `user`.

### 2.2 Create Koordinator Assignment
- **Method:** `POST`
- **URI:** `/koordinator-assignments`
- **Authorization:** `SUPER_ADMIN` only.
- **Request Body:**
```json
{
  "course_id": 1,
  "semester_id": 1,
  "user_id": 5
}
```
- **Validation Rules:**
  - `course_id`: Exists in courses
  - `semester_id`: Exists in semesters
  - `user_id`: Exists in users, and user MUST have `role === 'KOORDINATOR'`.
- **Success Response (201):** Returns the created assignment object.
- **Error Responses:**
  - `401 Unauthenticated`: Not logged in.
  - `403 Forbidden`: Logged in but not SUPER_ADMIN.
  - `409 Conflict`: `{"message": "Assignment already exists for this course and semester."}`
  - `422 Unprocessable Entity`: Validation failure (e.g. user is not a KOORDINATOR).

### 2.3 Delete Koordinator Assignment
- **Method:** `DELETE`
- **URI:** `/koordinator-assignments/{id}`
- **Authorization:** `SUPER_ADMIN` only.
- **Success Response (204):** No Content (Hard Delete).

### 2.4 List Penugasan Verifikators
- **Method:** `GET`
- **URI:** `/penugasan-verifikators`
- **Authorization:** Any authenticated user

### 2.5 Create Penugasan Verifikator
- **Method:** `POST`
- **URI:** `/penugasan-verifikators`
- **Authorization:** `SUPER_ADMIN` only.
- **Request Body:**
```json
{
  "semester_id": 1,
  "user_id": 7
}
```
- **Validation Rules:** User MUST have `role === 'VERIFIKATOR'`.
- **Error Responses:**
  - `409 Conflict`: `{"message": "Verifikator is already assigned for this semester."}`
  - `422 Unprocessable Entity`: Wrong role or invalid ID.

### 2.6 Delete Penugasan Verifikator
- **Method:** `DELETE`
- **URI:** `/penugasan-verifikators/{id}`
- **Authorization:** `SUPER_ADMIN` only.
- **Success Response (204):** No Content (Hard Delete).

---

## 3. Global Error Contract
The API strictly returns JSON errors with standard structures. Internal stack traces and SQL errors are suppressed.

- **401 Unauthenticated:** `{"message": "Unauthenticated."}`
- **403 Forbidden:** `{"message": "This action is unauthorized."}`
- **404 Not Found:** `{"message": "Resource not found."}`
- **422 Validation Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Specific error message."]
  }
}
```
- **409 Conflict:** `{"message": "Business conflict reason."}`

---

## 4. Manajemen Soal & Verifikasi (Phase 3)
Endpoints for question paper uploads and verification.

### 4.1 List Soals
- **Method:** `GET`
- **URI:** `/soals`
- **Authorization:** Authenticated users (Koordinator sees their own uploads, Verifikator sees all in their assigned semesters).
- **Query Parameters:** `status` (optional filter).

### 4.2 Upload Soal
- **Method:** `POST`
- **URI:** `/soals`
- **Authorization:** `KOORDINATOR` for the specific course & semester.
- **Request Body (multipart/form-data):**
  - `course_id`: number
  - `semester_id`: number
  - `exam_category`: string (UTS/UAS)
  - `file`: PDF/Doc file max 10MB
- **Error Responses:** 403 (Not Koordinator), 409 (Already Approved), 422 (Validation).

### 4.3 Detail Soal
- **Method:** `GET`
- **URI:** `/soals/{id}`
- **Authorization:** Authenticated user.

### 4.4 Verify Soal
- **Method:** `POST`
- **URI:** `/soals/{id}/verify`
- **Authorization:** `VERIFIKATOR` for the specific semester.
- **Request Body:**
  - `status`: APPROVED, REVISION, REJECTED
  - `notes`: string (required if REVISION or REJECTED)

### 4.5 Download Soal
- **Method:** `GET`
- **URI:** `/soals/{id}/download`

### 4.6 Berita Acara
- **Method:** `GET`
- **URI:** `/reports/berita-acara?semester_id=1`
- **Success Response:** Returns summary of total, approved, revision, rejected.
