from pydantic import BaseModel
from typing import List, Optional


class AlternativeMedicine(BaseModel):
    name: str
    description: str


class AlternativesGroup(BaseModel):
    allopathy: List[AlternativeMedicine] = []
    ayurveda: List[AlternativeMedicine] = []
    homeopathy: List[AlternativeMedicine] = []


class MedicineResult(BaseModel):
    brand_name: str
    generic_name: str
    alternatives: AlternativesGroup


class AnalysisResponse(BaseModel):
    medicines: List[MedicineResult]
    raw_text: str
    disclaimer: str


class HealthResponse(BaseModel):
    status: str
    message: str


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
