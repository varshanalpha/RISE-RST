"""Job Description parsing module for extracting structured requirement profiles."""

from pathlib import Path
import re
from typing import Any, Dict, List, Optional, Tuple
from app.models import Requirement, RequirementDict, RequirementProfile


class JDParseError(Exception):
    """Raised when Job Description reading or parsing fails."""

    pass


# Fixed category set
CATEGORIES = {"SKILL", "EXPERIENCE", "EDUCATION", "CERTIFICATION", "RESPONSIBILITY", "OTHER"}

# Known section headers that set parsing context and must NOT generate REQ objects
KNOWN_HEADERS: Dict[str, Tuple[str, str]] = {
    "ABOUT THE ROLE": ("INFO", "UNSPECIFIED"),
    "ABOUT THE COMPANY": ("INFO", "UNSPECIFIED"),
    "ROLE OVERVIEW": ("INFO", "UNSPECIFIED"),
    "JOB SUMMARY": ("INFO", "UNSPECIFIED"),
    "COMPANY OVERVIEW": ("INFO", "UNSPECIFIED"),
    "RESPONSIBILITIES": ("RESPONSIBILITIES", "UNSPECIFIED"),
    "KEY RESPONSIBILITIES": ("RESPONSIBILITIES", "UNSPECIFIED"),
    "PRIMARY RESPONSIBILITIES": ("RESPONSIBILITIES", "UNSPECIFIED"),
    "DUTIES": ("RESPONSIBILITIES", "UNSPECIFIED"),
    "ROLE RESPONSIBILITIES": ("RESPONSIBILITIES", "UNSPECIFIED"),
    "REQUIRED QUALIFICATIONS": ("QUALIFICATIONS", "REQUIRED"),
    "REQUIREMENTS": ("QUALIFICATIONS", "REQUIRED"),
    "MINIMUM QUALIFICATIONS": ("QUALIFICATIONS", "REQUIRED"),
    "MINIMUM REQUIREMENTS": ("QUALIFICATIONS", "REQUIRED"),
    "REQUIRED SKILLS": ("QUALIFICATIONS", "REQUIRED"),
    "MUST HAVE SKILLS": ("QUALIFICATIONS", "REQUIRED"),
    "WHAT YOU NEED": ("QUALIFICATIONS", "REQUIRED"),
    "PREFERRED QUALIFICATIONS": ("QUALIFICATIONS", "PREFERRED"),
    "PREFERRED SKILLS": ("QUALIFICATIONS", "PREFERRED"),
    "NICE TO HAVE SKILLS": ("QUALIFICATIONS", "PREFERRED"),
    "NICE TO HAVE": ("QUALIFICATIONS", "PREFERRED"),
    "DESIRED SKILLS": ("QUALIFICATIONS", "PREFERRED"),
    "BONUS QUALIFICATIONS": ("QUALIFICATIONS", "PREFERRED"),
    "QUALIFICATIONS": ("QUALIFICATIONS", "UNSPECIFIED"),
    "SKILLS": ("QUALIFICATIONS", "UNSPECIFIED"),
    "TECHNICAL SKILLS": ("QUALIFICATIONS", "UNSPECIFIED"),
    "KNOWLEDGE & SKILLS": ("QUALIFICATIONS", "UNSPECIFIED"),
    "WHAT WE OFFER": ("BENEFITS", "UNSPECIFIED"),
    "BENEFITS": ("BENEFITS", "UNSPECIFIED"),
    "PERKS": ("BENEFITS", "UNSPECIFIED"),
    "KEYWORDS": ("KEYWORDS", "UNSPECIFIED"),
    "TAGS": ("KEYWORDS", "UNSPECIFIED"),
}


def read_jd_file(file_path: str) -> str:
    """Read and validate a Job Description file.

    Args:
        file_path: Path to the .txt file.

    Returns:
        Raw text content of the JD.

    Raises:
        JDParseError: If file is missing, empty, or has unsupported extension.
    """
    if not file_path:
        raise JDParseError("Job Description file path is required.")

    path = Path(file_path)

    if not path.is_file():
        raise JDParseError(f"Job Description file not found: {file_path}")

    if path.suffix.lower() != ".txt":
        raise JDParseError(f"Unsupported JD file format '{path.suffix}'. Supported format: .txt")

    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        raise JDParseError(f"Failed to read Job Description file: {e}") from e

    if not text or not text.strip():
        raise JDParseError("Job Description file is empty.")

    return text.strip()


def _is_section_header(line: str) -> Optional[Tuple[str, str]]:
    """Check if a line is a section heading.

    Returns:
        Tuple of (section_type, priority) if line is a header, else None.
    """
    cleaned = line.strip()
    cleaned_norm = re.sub(r"^[●•\-\*\#\>]\s*", "", cleaned).strip()
    cleaned_norm = cleaned_norm.rstrip(":-. ").upper()

    if cleaned_norm in KNOWN_HEADERS:
        return KNOWN_HEADERS[cleaned_norm]

    # Additional heuristic for uppercase headers ending with colon
    if cleaned.endswith(":") and len(cleaned.split()) <= 4 and cleaned.rstrip(":").isupper():
        header_text = cleaned.rstrip(":").upper()
        if "REQUIRED" in header_text or "MUST HAVE" in header_text:
            return ("QUALIFICATIONS", "REQUIRED")
        elif "PREFERRED" in header_text or "DESIRED" in header_text or "NICE TO HAVE" in header_text:
            return ("QUALIFICATIONS", "PREFERRED")
        elif "RESPONSIBILIT" in header_text:
            return ("RESPONSIBILITIES", "UNSPECIFIED")
        else:
            return ("QUALIFICATIONS", "UNSPECIFIED")

    return None


def parse_jd(jd_text: str) -> Dict[str, List[RequirementDict]]:
    """Parse raw Job Description text into structured requirements.

    Args:
        jd_text: Extracted text from Job Description.

    Returns:
        Dict with key 'requirements' containing list of RequirementDict objects.
    """
    if not jd_text or not jd_text.strip():
        raise JDParseError("Job Description text is empty.")

    lines = jd_text.split("\n")
    requirements: List[Requirement] = []
    req_counter = 1

    current_section_type = "GENERAL"
    current_section_priority = "UNSPECIFIED"

    for idx, line in enumerate(lines):
        raw_line = line.strip()
        if not raw_line:
            continue

        header_match = _is_section_header(raw_line)
        if header_match:
            current_section_type, current_section_priority = header_match
            continue  # NEVER emit section headers as requirement objects!

        # Skip non-requirement sections (company info paragraphs, perks/benefits, keyword tag clouds)
        if current_section_type in ["INFO", "BENEFITS", "KEYWORDS"]:
            continue

        clean_text = re.sub(r"^[●•\-\*\#\>]\s*", "", raw_line).strip()
        if not clean_text:
            continue

        line_lower = clean_text.lower()

        # Skip top metadata lines (Company, Location, Employment Type, Role Title if first line)
        if idx == 0 and not re.search(r"\d", clean_text) and len(clean_text.split()) <= 4:
            continue  # Skip role title header line (e.g. "AI/ML ENGINEER")
        if any(clean_text.startswith(prefix) for prefix in ["Company:", "Location:", "Employment Type:"]):
            continue

        # Determine line-level priority override if explicit priority signal exists on line itself
        if any(sig in line_lower for sig in ["required", "must have", "mandatory", "minimum"]):
            line_priority = "REQUIRED"
        elif any(sig in line_lower for sig in ["preferred", "nice to have", "bonus", "good to have", "plus", "desired"]):
            line_priority = "PREFERRED"
        else:
            line_priority = current_section_priority

        # 1. Experience Requirements
        if re.search(r"\b(\d+\s*[\-–—]\s*\d+|\d+\+?|\bmin(?:imum)?\s*\d+)\s*(?:years?|yrs?)\b", line_lower) or line_lower.startswith("experience:"):
            req_id = f"REQ_{req_counter:03d}"
            req_counter += 1
            requirements.append(
                Requirement(
                    requirement_id=req_id,
                    category="EXPERIENCE",
                    value=clean_text,
                    priority=line_priority if line_priority != "UNSPECIFIED" else "REQUIRED",
                    evidence=clean_text,
                )
            )
            continue

        # 2. Education Requirements
        if any(deg in line_lower for deg in ["bachelor", "master", "ph.d", "degree", "diploma", "b.s.", "b.e.", "b.tech", "m.s."]):
            req_id = f"REQ_{req_counter:03d}"
            req_counter += 1
            requirements.append(
                Requirement(
                    requirement_id=req_id,
                    category="EDUCATION",
                    value=clean_text,
                    priority=line_priority if line_priority != "UNSPECIFIED" else "REQUIRED",
                    evidence=clean_text,
                )
            )
            continue

        # 3. Certification Requirements
        if any(cert in line_lower for cert in ["certification", "certified", "cissp", "ceh"]):
            req_id = f"REQ_{req_counter:03d}"
            req_counter += 1
            requirements.append(
                Requirement(
                    requirement_id=req_id,
                    category="CERTIFICATION",
                    value=clean_text,
                    priority=line_priority,
                    evidence=clean_text,
                )
            )
            continue

        # 4. Responsibilities Section Lines
        if current_section_type == "RESPONSIBILITIES":
            req_id = f"REQ_{req_counter:03d}"
            req_counter += 1
            requirements.append(
                Requirement(
                    requirement_id=req_id,
                    category="RESPONSIBILITY",
                    value=clean_text,
                    priority=line_priority,
                    evidence=clean_text,
                )
            )
            continue

        # 5. Skills / Qualifications Lines
        if current_section_type in ["QUALIFICATIONS", "SKILLS", "REQUIREMENTS", "GENERAL"]:
            req_id = f"REQ_{req_counter:03d}"
            req_counter += 1
            requirements.append(
                Requirement(
                    requirement_id=req_id,
                    category="SKILL",
                    value=clean_text,
                    priority=line_priority if line_priority != "UNSPECIFIED" else "REQUIRED",
                    evidence=clean_text,
                )
            )
            continue

    profile = RequirementProfile(requirements=requirements)
    return profile.to_dict()
