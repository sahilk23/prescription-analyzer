import json
import logging
from typing import List, Dict

import google.generativeai as genai

from utils.helpers import clean_json_response

logger = logging.getLogger(__name__)

NORMALIZE_PROMPT = (
    "You are given raw OCR text from a medical prescription. "
    "Extract only the medicine names from this text. "
    "Ignore patient details, doctor information, clinic names, dates, and dosage instructions. "
    "Normalize any brand names to their generic equivalents where possible. "
    "Return the result as a JSON array of objects with 'brand_name' and 'generic_name' fields. "
    "If the text already contains a JSON array, validate and clean it instead. "
    "Return only the JSON array, no other text.\n\nPrescription text:\n{text}"
)


async def extract_medicine_names(raw_text: str) -> List[Dict[str, str]]:
    """
    Parse the raw OCR text / JSON response and return a list of
    {'brand_name': ..., 'generic_name': ...} dicts.
    """
    # First, try to parse directly as JSON (Gemini may have returned JSON already)
    cleaned = clean_json_response(raw_text)
    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            return _normalize_list(data)
    except (json.JSONDecodeError, ValueError):
        pass

    # Fall back to asking Gemini to extract medicine names from free-form text
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = NORMALIZE_PROMPT.format(text=raw_text)
    response = model.generate_content(prompt)
    cleaned = clean_json_response(response.text)

    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            return _normalize_list(data)
    except (json.JSONDecodeError, ValueError):
        logger.warning("Could not parse medicine names from Gemini response: %s", response.text)
        return []

    return []


def _normalize_list(data: list) -> List[Dict[str, str]]:
    """Ensure every item has brand_name and generic_name keys."""
    result = []
    for item in data:
        if not isinstance(item, dict):
            continue
        brand = str(item.get("brand_name") or item.get("name") or "").strip()
        generic = str(item.get("generic_name") or brand).strip()
        if brand or generic:
            result.append({"brand_name": brand, "generic_name": generic or brand})
    return result
