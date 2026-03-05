import logging
import os

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import AnalysisResponse, ErrorResponse, HealthResponse, MedicineResult
from services.alternative_service import get_alternative_medicines
from services.medicine_service import extract_medicine_names
from services.ocr_service import extract_text_from_prescription
from utils.helpers import (
    DISCLAIMER,
    MAX_FILE_SIZE_BYTES,
    validate_file_extension,
    validate_file_size,
)

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    logger.warning("GEMINI_API_KEY is not set. API calls will fail.")

app = FastAPI(
    title="Prescription Analyzer API",
    description="Analyzes medical prescriptions and recommends alternative medicines.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="ok", message="Prescription Analyzer API is running.")


@app.post(
    "/api/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def analyze_prescription(file: UploadFile = File(...)):
    """
    Accept a prescription image or PDF, extract medicine names using Gemini Vision,
    and return alternative medicines in Allopathy, Ayurveda, and Homeopathy categories.
    """
    # Validate file extension
    if not validate_file_extension(file.filename or ""):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a JPG, PNG, or PDF file.",
        )

    # Read file bytes
    file_bytes = await file.read()

    # Validate file size
    if not validate_file_size(len(file_bytes)):
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds the maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: GEMINI_API_KEY is not configured.",
        )

    try:
        # Step 1: Extract text from prescription
        logger.info("Extracting text from prescription: %s", file.filename)
        raw_text = await extract_text_from_prescription(
            file_bytes, file.content_type or "image/jpeg"
        )

        # Step 2: Extract and normalize medicine names
        logger.info("Extracting medicine names from text")
        medicines_raw = await extract_medicine_names(raw_text)

        if not medicines_raw:
            raise HTTPException(
                status_code=422,
                detail="No medicines could be detected in the uploaded prescription.",
            )

        # Step 3: Get alternatives for each medicine
        results = []
        for med in medicines_raw:
            medicine_name = med.get("generic_name") or med.get("brand_name", "")
            if not medicine_name:
                continue
            logger.info("Getting alternatives for: %s", medicine_name)
            alternatives = await get_alternative_medicines(medicine_name)
            results.append(
                MedicineResult(
                    brand_name=med.get("brand_name", medicine_name),
                    generic_name=med.get("generic_name", medicine_name),
                    alternatives=alternatives,
                )
            )

        return AnalysisResponse(
            medicines=results,
            raw_text=raw_text,
            disclaimer=DISCLAIMER,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error during prescription analysis")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(exc)}",
        ) from exc
