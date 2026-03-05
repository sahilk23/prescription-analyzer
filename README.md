# Prescription Analyzer 💊

> **⚠️ Disclaimer: This tool provides informational alternatives only and is not a substitute for professional medical advice. Always consult a qualified healthcare professional before making changes to your medication.**

An AI-powered web application that analyzes medical prescriptions uploaded by users and recommends alternative medicines from **Allopathy**, **Ayurveda**, and **Homeopathy** systems.

---

## Features

- 📤 **Drag-and-drop prescription upload** (JPG, PNG, PDF)
- 🔍 **AI-powered OCR** — Extracts medicine names using Google Gemini Vision API
- 🔄 **Brand → Generic name normalization**
- 💊 **Alternative medicine suggestions** across three medical systems:
  - **Allopathy** — Conventional pharmaceutical alternatives
  - **Ayurveda** — Traditional herbal and natural remedies
  - **Homeopathy** — Homeopathic medicine alternatives
- 📋 **Copy & print** results
- 📱 **Responsive design** — Works on mobile and desktop
- ✅ **File validation** — Type and size checks on both frontend and backend
- ⚠️ **Prominent medical disclaimer** throughout the UI and API

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, Vite, TailwindCSS                     |
| Backend  | Python 3.9+, FastAPI, Uvicorn                   |
| AI / OCR | Google Gemini 1.5 Flash (Vision + Text)         |

---

## Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm 9+**
- A **Google Gemini API key** — [Get one here](https://aistudio.google.com/app/apikey)

---

## Project Structure

```
prescription-analyzer/
├── backend/
│   ├── main.py                   # FastAPI app entry point
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variable template
│   ├── services/
│   │   ├── ocr_service.py        # Prescription text extraction (Gemini Vision)
│   │   ├── medicine_service.py   # Medicine name extraction & normalization
│   │   └── alternative_service.py# Alternative medicine generation (Gemini)
│   ├── models/
│   │   └── schemas.py            # Pydantic request/response models
│   └── utils/
│       └── helpers.py            # Shared utilities & constants
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── FileUpload.jsx
│       │   ├── MedicineList.jsx
│       │   ├── AlternativePanel.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── ErrorMessage.jsx
│       │   └── Disclaimer.jsx
│       └── services/
│           └── api.js
├── .gitignore
└── README.md
```

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/sahilk23/prescription-analyzer.git
cd prescription-analyzer
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

---

## Environment Variables

Create `backend/.env` (copy from `backend/.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Running Locally

### Start the Backend

```bash
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Documentation

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Prescription Analyzer API is running."
}
```

---

### `POST /api/analyze`

Upload a prescription file and receive extracted medicines with alternatives.

**Request:** `multipart/form-data` with a `file` field (JPG / PNG / PDF, max 10 MB).

**Response (200 OK):**
```json
{
  "medicines": [
    {
      "brand_name": "Crocin",
      "generic_name": "Paracetamol",
      "alternatives": {
        "allopathy": [
          {"name": "Acetaminophen", "description": "Same active ingredient, different brand"},
          {"name": "Calpol", "description": "Paracetamol-based analgesic"}
        ],
        "ayurveda": [
          {"name": "Giloy", "description": "Natural fever reducer and immunity booster"}
        ],
        "homeopathy": [
          {"name": "Belladonna", "description": "Used for sudden high fever with headache"}
        ]
      }
    }
  ],
  "raw_text": "...",
  "disclaimer": "This tool provides informational alternatives only..."
}
```

**Error Responses:**

| Status | Description                           |
|--------|---------------------------------------|
| 400    | Unsupported file format               |
| 400    | File exceeds 10 MB size limit         |
| 422    | No medicines detected in prescription |
| 500    | Server / API configuration error      |

---

## Screenshots

<!-- Add screenshots here after running the application -->
*Coming soon — run the application locally to see the interface.*

---

## Medical Disclaimer

> **⚠️ This tool provides informational alternatives only and is not a substitute for professional medical advice. Always consult a qualified healthcare professional before making any changes to your medication regimen.**

This disclaimer is displayed prominently in:
- The application header
- The results page
- Every API response (`disclaimer` field)
- This README
