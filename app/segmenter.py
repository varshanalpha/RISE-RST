"""Section segmentation module for partitioning raw resume text into logical sections."""

import re
from typing import Dict, List, Optional, Tuple

# Fixed, versioned section allowlist mapping canonical section IDs to heading variations
SECTION_PATTERNS: Dict[str, List[str]] = {
    "CONTACT": [
        "CONTACT",
        "CONTACT INFORMATION",
        "CONTACT DETAILS",
        "PERSONAL INFORMATION",
        "PERSONAL DETAILS",
        "CONTACT ME",
    ],
    "SUMMARY": [
        "SUMMARY",
        "PROFESSIONAL SUMMARY",
        "EXECUTIVE SUMMARY",
        "CAREER SUMMARY",
        "SUMMARY OF QUALIFICATIONS",
        "PROFILE",
        "PERSONAL PROFILE",
        "PROFESSIONAL PROFILE",
        "CAREER OBJECTIVE",
        "OBJECTIVE",
        "ABOUT ME",
    ],
    "EDUCATION": [
        "EDUCATION",
        "EDUCATIONAL BACKGROUND",
        "ACADEMIC BACKGROUND",
        "ACADEMIC QUALIFICATIONS",
        "EDUCATION & QUALIFICATIONS",
        "EDUCATION AND QUALIFICATIONS",
        "ACADEMICS",
        "SCHOLASTIC ACHIEVEMENTS",
    ],
    "EXPERIENCE": [
        "EXPERIENCE",
        "WORK EXPERIENCE",
        "PROFESSIONAL EXPERIENCE",
        "EMPLOYMENT HISTORY",
        "WORK HISTORY",
        "EMPLOYMENT",
        "CAREER HISTORY",
        "INTERNSHIPS",
        "INTERNSHIP EXPERIENCE",
        "PRACTICAL EXPERIENCE",
        "RELEVANT EXPERIENCE",
    ],
    "SKILLS": [
        "SKILLS",
        "TECHNICAL SKILLS",
        "TECHNICAL SKILLS & TOOLS",
        "TECHNICAL SKILLS AND TOOLS",
        "CORE COMPETENCIES",
        "SKILLS & COMPETENCIES",
        "SKILLS AND COMPETENCIES",
        "TECHNICAL PROFICIENCIES",
        "SKILLS & TECHNOLOGIES",
        "SKILLS AND TECHNOLOGIES",
        "AREAS OF EXPERTISE",
        "KEY SKILLS",
        "HARD SKILLS",
        "SOFT SKILLS",
        "COMPUTER SKILLS",
    ],
    "PROJECTS": [
        "PROJECTS",
        "KEY PROJECTS",
        "ACADEMIC PROJECTS",
        "PERSONAL PROJECTS",
        "SELECTED PROJECTS",
        "CYBERSECURITY & NETWORKING PROJECTS",
        "CYBERSECURITY AND NETWORKING PROJECTS",
        "CYBERSECURITY PROJECTS",
        "NETWORKING PROJECTS",
        "TECHNICAL PROJECTS",
        "PORTFOLIO",
    ],
    "CERTIFICATIONS": [
        "CERTIFICATIONS",
        "CERTIFICATION",
        "CERTIFICATES",
        "LICENSES & CERTIFICATIONS",
        "LICENSES AND CERTIFICATIONS",
        "CERTIFICATIONS & LICENSES",
        "CERTIFICATIONS AND LICENSES",
        "SELECTED CERTIFICATIONS",
        "PROFESSIONAL CERTIFICATIONS",
    ],
    "COURSEWORK": [
        "COURSEWORK",
        "RELEVANT COURSEWORK",
        "KEY COURSEWORK",
        "RELATED COURSEWORK",
        "ACADEMIC COURSEWORK",
    ],
    "LANGUAGES": [
        "LANGUAGES",
        "LANGUAGES SPOKEN",
        "LANGUAGE PROFICIENCY",
        "FOREIGN LANGUAGES",
    ],
    "ACHIEVEMENTS": [
        "ACHIEVEMENTS",
        "ACCOMPLISHMENTS",
        "HONORS & AWARDS",
        "HONORS AND AWARDS",
        "AWARDS & HONORS",
        "AWARDS AND HONORS",
        "AWARDS",
        "KEY ACHIEVEMENTS",
        "SELECTED ACHIEVEMENTS",
    ],
}


def _normalize_heading_candidate(line: str) -> str:
    """Normalize a candidate heading line for matching against the allowlist."""
    cleaned = line.strip()
    cleaned = re.sub(r"^[0-9]+[\.\)]\s*", "", cleaned)
    cleaned = re.sub(r"^[•\-\*\#\>]\s*", "", cleaned)
    cleaned = cleaned.rstrip(":-. ")
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.upper()


def _match_section_id(line: str) -> Optional[Tuple[str, str]]:
    """Check if a line matches a recognized section heading.

    Returns:
        Tuple of (canonical_section_id, original_line) if matched, else None.
    """
    raw_line = line.strip()
    if not raw_line:
        return None

    words = raw_line.split()
    if len(raw_line) > 60 or len(words) > 8:
        return None

    normalized = _normalize_heading_candidate(raw_line)
    if not normalized:
        return None

    for section_id, variations in SECTION_PATTERNS.items():
        for variation in variations:
            if normalized == variation:
                return (section_id, raw_line)

    return None


def segment_text(text: str) -> List[Dict[str, str]]:
    """Segment raw resume text into recognized section blocks.

    Args:
        text: Extracted raw text from a resume.

    Returns:
        List of section dictionaries containing:
        - section_id: Canonical section ID or 'UNSECTIONED'
        - heading: Original heading string as appeared in text
        - text: Content text belonging to the section
    """
    if not text or not text.strip():
        return []

    lines = text.split("\n")

    sections: List[Dict[str, str]] = []
    current_section_id: Optional[str] = None
    current_heading: str = ""
    current_lines: List[str] = []

    for line in lines:
        match = _match_section_id(line)

        if match:
            if current_lines:
                sec_text = "\n".join(current_lines).strip()
                if sec_text:
                    sections.append(
                        {
                            "section_id": current_section_id or "UNSECTIONED",
                            "heading": current_heading,
                            "text": sec_text,
                        }
                    )

            section_id, orig_heading = match
            current_section_id = section_id
            current_heading = orig_heading
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        sec_text = "\n".join(current_lines).strip()
        if sec_text:
            sections.append(
                {
                    "section_id": current_section_id or "UNSECTIONED",
                    "heading": current_heading,
                    "text": sec_text,
                }
            )

    return sections

