import json
import logging
from typing import Dict, List

import google.generativeai as genai

from utils.helpers import clean_json_response

logger = logging.getLogger(__name__)

ALTERNATIVES_PROMPT = """Provide alternative medicines for the following drug.

Drug: {medicine_name}

Provide alternatives in three categories:
1. Allopathy
2. Ayurveda
3. Homeopathy

For each alternative, provide the name and a brief one-line description.
Return the result ONLY as valid JSON with this exact structure:
{{
  "allopathy": [{{"name": "...", "description": "..."}}],
  "ayurveda": [{{"name": "...", "description": "..."}}],
  "homeopathy": [{{"name": "...", "description": "..."}}]
}}"""


async def get_alternative_medicines(medicine_name: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Call Gemini API to get Allopathy, Ayurveda, and Homeopathy alternatives
    for the given medicine name.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = ALTERNATIVES_PROMPT.format(medicine_name=medicine_name)
    response = model.generate_content(prompt)

    cleaned = clean_json_response(response.text)
    try:
        data = json.loads(cleaned)
        return {
            "allopathy": _parse_alternatives(data.get("allopathy", [])),
            "ayurveda": _parse_alternatives(data.get("ayurveda", [])),
            "homeopathy": _parse_alternatives(data.get("homeopathy", [])),
        }
    except (json.JSONDecodeError, ValueError, AttributeError):
        logger.warning(
            "Could not parse alternatives for '%s': %s", medicine_name, response.text
        )
        return {"allopathy": [], "ayurveda": [], "homeopathy": []}


def _parse_alternatives(items: list) -> List[Dict[str, str]]:
    result = []
    for item in items:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or "").strip()
        description = str(item.get("description") or "").strip()
        if name:
            result.append({"name": name, "description": description})
    return result
