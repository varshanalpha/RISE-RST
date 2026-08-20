"""Data models and schemas for structured candidate profiles and evidence tracking."""

from dataclasses import dataclass
from typing import Any, Dict, Optional, TypedDict,List


class FieldResultDict(TypedDict):
    """Dictionary representation of a parsed field with evidence tracking."""

    status: str  # "FOUND", "NOT_FOUND", "AMBIGUOUS"
    value: Any
    evidence: Optional[str]
    source_section: Optional[str]


@dataclass
class FieldResult:
    """Represents a single parsed field with traceable evidence."""

    status: str  # "FOUND", "NOT_FOUND", "AMBIGUOUS"
    value: Any = None
    evidence: Optional[str] = None
    source_section: Optional[str] = None

    def to_dict(self) -> FieldResultDict:
        return {
            "status": self.status,
            "value": self.value,
            "evidence": self.evidence,
            "source_section": self.source_section,
        }

    @classmethod
    def not_found(cls) -> "FieldResult":
        return cls(status="NOT_FOUND", value=None, evidence=None, source_section=None)

    @classmethod
    def ambiguous(cls) -> "FieldResult":
        return cls(status="AMBIGUOUS", value=None, evidence=None, source_section=None)


class SectionDict(TypedDict):
    """Dictionary representation of a segmented resume section."""

    section_id: str
    heading: str
    text: str


@dataclass
class Section:
    """Data model representing a segmented resume section."""

    section_id: str
    heading: str
    text: str

    def to_dict(self) -> SectionDict:
        return {
            "section_id": self.section_id,
            "heading": self.heading,
            "text": self.text,
        }


@dataclass
class CandidateProfile:
    """Complete candidate profile containing all 11 required fields."""

    name: FieldResult
    email: FieldResult
    phone: FieldResult
    linkedin: FieldResult
    location: FieldResult
    education: FieldResult
    graduation_year: FieldResult
    skills: FieldResult
    projects: FieldResult
    certifications: FieldResult
    experience: FieldResult

    def to_dict(self) -> Dict[str, FieldResultDict]:
        return {
            "name": self.name.to_dict(),
            "email": self.email.to_dict(),
            "phone": self.phone.to_dict(),
            "linkedin": self.linkedin.to_dict(),
            "location": self.location.to_dict(),
            "education": self.education.to_dict(),
            "graduation_year": self.graduation_year.to_dict(),
            "skills": self.skills.to_dict(),
            "projects": self.projects.to_dict(),
            "certifications": self.certifications.to_dict(),
            "experience": self.experience.to_dict(),
        }


class RequirementDict(TypedDict):
    """Dictionary representation of a parsed job requirement."""

    requirement_id: str
    category: str
    value: str
    priority: str
    evidence: str


@dataclass
class Requirement:
    """Represents a single job description requirement."""

    requirement_id: str
    category: str  # SKILL, EXPERIENCE, EDUCATION, CERTIFICATION, RESPONSIBILITY, OTHER
    value: str
    priority: str  # REQUIRED, PREFERRED, UNSPECIFIED
    evidence: str

    def to_dict(self) -> RequirementDict:
        return {
            "requirement_id": self.requirement_id,
            "category": self.category,
            "value": self.value,
            "priority": self.priority,
            "evidence": self.evidence,
        }


@dataclass
class RequirementProfile:
    """Collection of extracted job description requirements."""

    requirements: List[Requirement]

    def to_dict(self) -> Dict[str, List[RequirementDict]]:
        return {
            "requirements": [r.to_dict() for r in self.requirements]
        }


class RequirementMatchDict(TypedDict):
    """Dictionary representation of a single requirement match result."""

    requirement_id: str
    category: str
    requirement_value: str
    priority: str
    status: str  # "MATCHED", "PARTIAL", "NOT_FOUND"
    jd_evidence: str
    resume_evidence: str


@dataclass
class RequirementMatch:
    """Represents the match status and evidence for a single job requirement."""

    requirement_id: str
    category: str
    requirement_value: str
    priority: str
    status: str  # "MATCHED", "PARTIAL", "NOT_FOUND"
    jd_evidence: str
    resume_evidence: str

    def to_dict(self) -> RequirementMatchDict:
        return {
            "requirement_id": self.requirement_id,
            "category": self.category,
            "requirement_value": self.requirement_value,
            "priority": self.priority,
            "status": self.status,
            "jd_evidence": self.jd_evidence,
            "resume_evidence": self.resume_evidence,
        }


@dataclass
class MatchProfile:
    """Collection of match results for all job description requirements."""

    matches: List[RequirementMatch]

    def to_dict(self) -> Dict[str, List[RequirementMatchDict]]:
        return {
            "matches": [m.to_dict() for m in self.matches]
        }


class CategoryScoreDict(TypedDict):
    """Dictionary representation of a category-level match score."""

    earned_score: float
    maximum_score: float
    percentage: float


@dataclass
class CategoryScore:
    """Represents category-level match score metrics."""

    earned_score: float
    maximum_score: float
    percentage: float

    def to_dict(self) -> CategoryScoreDict:
        return {
            "earned_score": self.earned_score,
            "maximum_score": self.maximum_score,
            "percentage": self.percentage,
        }


class RequirementScoreDict(TypedDict):
    """Dictionary representation of an individual requirement score."""

    requirement_id: str
    category: str
    priority: str
    status: str
    weight: float
    score: float


@dataclass
class RequirementScore:
    """Represents calculated score for a single requirement."""

    requirement_id: str
    category: str
    priority: str
    status: str
    weight: float
    score: float

    def to_dict(self) -> RequirementScoreDict:
        return {
            "requirement_id": self.requirement_id,
            "category": self.category,
            "priority": self.priority,
            "status": self.status,
            "weight": self.weight,
            "score": self.score,
        }


class ScoreProfileDict(TypedDict):
    """Dictionary representation of the overall deterministic match score profile."""

    overall_score: float
    earned_score: float
    maximum_score: float
    category_scores: Dict[str, CategoryScoreDict]
    requirement_scores: List[RequirementScoreDict]


@dataclass
class ScoreProfile:
    """Complete deterministic score profile."""

    overall_score: float
    earned_score: float
    maximum_score: float
    category_scores: Dict[str, CategoryScore]
    requirement_scores: List[RequirementScore]

    def to_dict(self) -> ScoreProfileDict:
        return {
            "overall_score": self.overall_score,
            "earned_score": self.earned_score,
            "maximum_score": self.maximum_score,
            "category_scores": {
                k: v.to_dict() for k, v in self.category_scores.items()
            },
            "requirement_scores": [
                r.to_dict() for r in self.requirement_scores
            ],
        }





