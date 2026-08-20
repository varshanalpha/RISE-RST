"""Field parsing module for extracting structured fields and evidence from segmented resume sections."""

import re
from typing import Any, Dict, List, Optional, Tuple
from app.models import CandidateProfile, FieldResult, FieldResultDict


def parse_fields(sections: List[Dict[str, str]]) -> Dict[str, FieldResultDict]:
    """Parse structured candidate fields from segmented resume sections.

    Args:
        sections: List of section dicts containing 'section_id', 'heading', and 'text'.

    Returns:
        Dictionary mapping field names to FieldResultDict structures.
    """
    profile = CandidateProfile(
        name=_extract_name(sections),
        email=_extract_email(sections),
        phone=_extract_phone(sections),
        linkedin=_extract_linkedin(sections),
        location=_extract_location(sections),
        education=_extract_education(sections),
        graduation_year=_extract_graduation_year(sections),
        skills=_extract_skills(sections),
        projects=_extract_projects(sections),
        certifications=_extract_certifications(sections),
        experience=_extract_experience(sections),
    )
    return profile.to_dict()


def _get_section(sections: List[Dict[str, str]], section_id: str) -> Optional[Dict[str, str]]:
    for sec in sections:
        if sec.get("section_id") == section_id:
            return sec
    return None


# --- 1. NAME ---
def _extract_name(sections: List[Dict[str, str]]) -> FieldResult:
    top_sec = _get_section(sections, "UNSECTIONED") or _get_section(sections, "CONTACT")
    if not top_sec or not top_sec.get("text"):
        return FieldResult.not_found()

    lines = [line.strip() for line in top_sec["text"].split("\n") if line.strip()]
    candidates: List[Tuple[str, str]] = []

    for line in lines:
        # Skip lines containing email, URL, phone digits, or common contact labels
        if any(char in line for char in ["@", "http", "linkedin.com", "+"]) or re.search(r"\d", line):
            continue

        words = line.split()
        if 2 <= len(words) <= 5:
            # Check if all words consist of letters/dots
            if all(re.match(r"^[A-Za-z\.]+$", word) for word in words):
                candidates.append((line, top_sec["section_id"]))

    if len(candidates) == 1:
        name_val, sec_id = candidates[0]
        return FieldResult(
            status="FOUND",
            value=name_val,
            evidence=name_val,
            source_section=sec_id,
        )
    elif len(candidates) > 1:
        return FieldResult.ambiguous()

    return FieldResult.not_found()


# --- 2. EMAIL ---
def _extract_email(sections: List[Dict[str, str]]) -> FieldResult:
    email_pattern = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
    found_emails: List[Tuple[str, str, str]] = []

    for sec in sections:
        sec_id = sec.get("section_id", "UNSECTIONED")
        text = sec.get("text", "")
        for line in text.split("\n"):
            matches = email_pattern.findall(line)
            for email in matches:
                found_emails.append((email, line.strip(), sec_id))

    # Deduplicate by email address
    unique_emails = {item[0]: item for item in found_emails}

    if len(unique_emails) == 1:
        email, line_evidence, sec_id = list(unique_emails.values())[0]
        return FieldResult(
            status="FOUND",
            value=email,
            evidence=line_evidence,
            source_section=sec_id,
        )
    elif len(unique_emails) > 1:
        return FieldResult.ambiguous()

    return FieldResult.not_found()


# --- 3. PHONE ---
def _extract_phone(sections: List[Dict[str, str]]) -> FieldResult:
    phone_pattern = re.compile(
        r"(?:\+\d{1,3}[\s\-]?)?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}"
    )
    found_phones: List[Tuple[str, str, str]] = []

    for sec in sections:
        sec_id = sec.get("section_id", "UNSECTIONED")
        text = sec.get("text", "")
        for line in text.split("\n"):
            matches = phone_pattern.findall(line)
            for p in matches:
                digits_only = re.sub(r"\D", "", p)
                # Ensure it's a plausible phone number length (e.g. 7-15 digits) and not a year or CGPA
                if 7 <= len(digits_only) <= 15:
                    found_phones.append((p.strip(), line.strip(), sec_id))

    unique_phones = {item[0]: item for item in found_phones}

    if len(unique_phones) == 1:
        phone, line_evidence, sec_id = list(unique_phones.values())[0]
        return FieldResult(
            status="FOUND",
            value=phone,
            evidence=line_evidence,
            source_section=sec_id,
        )
    elif len(unique_phones) > 1:
        return FieldResult.ambiguous()

    return FieldResult.not_found()


# --- 4. LINKEDIN ---
def _extract_linkedin(sections: List[Dict[str, str]]) -> FieldResult:
    linkedin_pattern = re.compile(
        r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_\-]+"
    )
    found_links: List[Tuple[str, str, str]] = []

    for sec in sections:
        sec_id = sec.get("section_id", "UNSECTIONED")
        text = sec.get("text", "")
        for line in text.split("\n"):
            matches = linkedin_pattern.findall(line)
            for link in matches:
                found_links.append((link.strip(), line.strip(), sec_id))

    unique_links = {item[0]: item for item in found_links}

    if len(unique_links) == 1:
        link, line_evidence, sec_id = list(unique_links.values())[0]
        return FieldResult(
            status="FOUND",
            value=link,
            evidence=line_evidence,
            source_section=sec_id,
        )
    elif len(unique_links) > 1:
        return FieldResult.ambiguous()

    return FieldResult.not_found()


# --- 5. LOCATION ---
def _extract_location(sections: List[Dict[str, str]]) -> FieldResult:
    top_sec = _get_section(sections, "UNSECTIONED") or _get_section(sections, "CONTACT")
    if not top_sec or not top_sec.get("text"):
        return FieldResult.not_found()

    lines = top_sec["text"].split("\n")
    for line in lines:
        parts = [p.strip() for p in line.split("|")]
        for part in parts:
            # Check for City, State, Country pattern (e.g. Coimbatore, Tamil Nadu, India)
            if part.count(",") >= 1:
                subparts = [sp.strip() for sp in part.split(",")]
                if all(re.match(r"^[A-Za-z\s]+$", sp) for sp in subparts):
                    return FieldResult(
                        status="FOUND",
                        value=part,
                        evidence=part,
                        source_section=top_sec["section_id"],
                    )

    return FieldResult.not_found()


# --- 6. EDUCATION ---
def _extract_education(sections: List[Dict[str, str]]) -> FieldResult:
    edu_sec = _get_section(sections, "EDUCATION")
    if not edu_sec or not edu_sec.get("text"):
        return FieldResult.not_found()

    raw_text = edu_sec["text"].strip()
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    items: List[Dict[str, Any]] = []
    current_item: Optional[Dict[str, Any]] = None

    for line in lines:
        # Check if line indicates a new degree / program
        if any(keyword in line for keyword in ["Bachelor", "B.E.", "B.Tech", "Master", "Intermediate", "Secondary", "Class"]):
            if current_item:
                items.append(current_item)
            current_item = {"degree": line, "institution": "", "years": "", "grade": ""}
            # Extract date range if on the same line
            year_match = re.search(r"\b(20\d{2}\s*[\-\–\—]\s*20\d{2}|20\d{2})\b", line)
            if year_match:
                current_item["years"] = year_match.group(0)
                current_item["degree"] = line.replace(year_match.group(0), "").strip()
        elif current_item:
            # Parse institution and grade
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 1 and not current_item["institution"]:
                current_item["institution"] = parts[0]
            if len(parts) >= 2 and not current_item["grade"]:
                current_item["grade"] = parts[1]

    if current_item:
        items.append(current_item)

    if items:
        return FieldResult(
            status="FOUND",
            value=items,
            evidence=raw_text,
            source_section="EDUCATION",
        )

    return FieldResult.not_found()


# --- 7. GRADUATION YEAR ---
def _extract_graduation_year(sections: List[Dict[str, str]]) -> FieldResult:
    edu_sec = _get_section(sections, "EDUCATION")
    if not edu_sec or not edu_sec.get("text"):
        return FieldResult.not_found()

    lines = [line.strip() for line in edu_sec["text"].split("\n") if line.strip()]
    candidate_years: List[Tuple[str, str]] = []

    for line in lines:
        # Look for higher education degree titles
        if any(keyword in line for keyword in ["Bachelor", "B.E.", "B.Tech", "Master", "M.S.", "B.S."]):
            match = re.search(r"20\d{2}\s*[\-\–\—]\s*(20\d{2})", line)
            if match:
                grad_yr = match.group(1)
                candidate_years.append((grad_yr, line))

    if len(candidate_years) == 1:
        grad_yr, line_ev = candidate_years[0]
        return FieldResult(
            status="FOUND",
            value=grad_yr,
            evidence=line_ev,
            source_section="EDUCATION",
        )
    elif len(candidate_years) > 1:
        return FieldResult.ambiguous()

    return FieldResult.not_found()


# --- 8. SKILLS ---
def _extract_skills(sections: List[Dict[str, str]]) -> FieldResult:
    skills_sec = _get_section(sections, "SKILLS")
    if not skills_sec or not skills_sec.get("text"):
        return FieldResult.not_found()

    raw_text = skills_sec["text"].strip()
    extracted_skills: List[str] = []

    for line in raw_text.split("\n"):
        line_clean = line.strip()
        if not line_clean:
            continue
        # Remove category label prefix if present (e.g. 'Networking:')
        if ":" in line_clean:
            _, skills_part = line_clean.split(":", 1)
        else:
            skills_part = line_clean

        # Split by comma or pipe
        items = [s.strip() for s in re.split(r"[,|]", skills_part) if s.strip()]
        for item in items:
            item_clean = re.sub(r"^[●•\-\*\#\>]\s*", "", item).strip()
            if item_clean and item_clean not in extracted_skills:
                extracted_skills.append(item_clean)

    if extracted_skills:
        return FieldResult(
            status="FOUND",
            value=extracted_skills,
            evidence=raw_text,
            source_section="SKILLS",
        )

    return FieldResult.not_found()


# --- 9. PROJECTS ---
def _extract_projects(sections: List[Dict[str, str]]) -> FieldResult:
    proj_sec = _get_section(sections, "PROJECTS")
    if not proj_sec or not proj_sec.get("text"):
        return FieldResult.not_found()

    raw_text = proj_sec["text"].strip()
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    projects: List[Dict[str, Any]] = []
    current_title: str = ""
    current_desc_lines: List[str] = []

    for line in lines:
        is_bullet = bool(re.match(r"^[●•\-\*\#\>]", line))
        cleaned_bullet = re.sub(r"^[●•\-\*\#\>]\s*", "", line).strip()

        if is_bullet:
            current_desc_lines.append(cleaned_bullet)
        elif not current_title:
            current_title = line
        else:
            # Continuation line of previous bullet or description
            current_desc_lines.append(line)

    if current_title:
        desc_text = " ".join(current_desc_lines).strip()
        projects.append(
            {
                "title": current_title,
                "description": desc_text,
                "evidence": f"{current_title}\n{desc_text}".strip(),
            }
        )

    if projects:
        return FieldResult(
            status="FOUND",
            value=projects,
            evidence=raw_text,
            source_section="PROJECTS",
        )

    return FieldResult.not_found()



# --- 10. CERTIFICATIONS ---
def _extract_certifications(sections: List[Dict[str, str]]) -> FieldResult:
    cert_sec = _get_section(sections, "CERTIFICATIONS")
    if not cert_sec or not cert_sec.get("text"):
        return FieldResult.not_found()

    raw_text = cert_sec["text"].strip()
    cert_lines = [
        re.sub(r"^[●\-\*\#\>]\s*", "", line.strip()).strip()
        for line in raw_text.split("\n")
        if line.strip()
    ]

    if cert_lines:
        return FieldResult(
            status="FOUND",
            value=cert_lines,
            evidence=raw_text,
            source_section="CERTIFICATIONS",
        )

    return FieldResult.not_found()


# --- 11. EXPERIENCE ---
def _extract_experience(sections: List[Dict[str, str]]) -> FieldResult:
    exp_sec = _get_section(sections, "EXPERIENCE")
    if not exp_sec or not exp_sec.get("text"):
        return FieldResult.not_found()

    raw_text = exp_sec["text"].strip()
    return FieldResult(
        status="FOUND",
        value=raw_text,
        evidence=raw_text,
        source_section="EXPERIENCE",
    )

