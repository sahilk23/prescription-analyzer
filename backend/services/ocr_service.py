import io
import logging
import base64

import google.generativeai as genai
from PIL import Image

logger = logging.getLogger(__name__)

OCR_PROMPT = (
    "Extract only the medicine names from the following prescription image. "
    "Ignore patient details, doctor information, and dosage instructions. "
    "If you find brand names, also include the generic name. "
    'Return the output as a JSON array of objects with "brand_name" and "generic_name" fields. '
    "Example: [{\"brand_name\": \"Crocin\", \"generic_name\": \"Paracetamol\"}]. "
    "If no medicines are found return an empty array []."
)


async def extract_text_from_prescription(file_bytes: bytes, content_type: str) -> str:
    """
    Send the prescription image/PDF to Gemini Vision and return the raw text response.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")

    if content_type == "application/pdf":
        # Encode PDF as base64 and send as a blob part
        encoded = base64.standard_b64encode(file_bytes).decode("utf-8")
        response = model.generate_content(
            [
                {"mime_type": "application/pdf", "data": encoded},
                OCR_PROMPT,
            ]
        )
    else:
        # Convert image bytes to PIL Image for Gemini
        image = Image.open(io.BytesIO(file_bytes))
        response = model.generate_content([image, OCR_PROMPT])

    return response.text
