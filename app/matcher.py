"""Deterministic Resume-to-Job Requirement Matching Module with Precise Evidence Selection & Cleanup."""

import re
from typing import Any, Dict, List, Optional, Set, Tuple
from app.models import MatchProfile, RequirementMatch, RequirementMatchDict


class MatcherError(Exception):
    """Raised when matching inputs are missing or invalid."""

    pass


# Deterministic skill alias map
SKILL_ALIASES: Dict[str, str] = {
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "llm": "large language models",
    "llms": "large language models",
    "rag": "retrieval-augmented generation",
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "postgres": "postgresql",
    "rest api": "rest apis",
}

SECTION_DISPLAY_NAMES: Dict[str, str] = {
    "experience": "Experience",
    "skills": "Skills",
    "projects": "Projects",
    "education": "Education",
    "certifications": "Certifications",
    "summary": "Summary",
    "contact": "Contact",
}


def clean_evidence(text: Optional[str]) -> str:
    """Clean PDF CID artifacts, unicode escapes, control characters, and malformed whitespace."""
    if not text or text == "NOT_FOUND":
        return "NOT_FOUND"

    # Remove (cid:number) artifacts
    cleaned = re.sub(r"\(cid:\d+\)", "", str(text))

    # Normalize common unicode characters and dashes
    cleaned = cleaned.replace("\u2014", "—").replace("\u2013", "–")

    # Clean multiline lines and whitespace
    lines = [re.sub(r"\s+", " ", line).strip() for line in cleaned.split("\n")]
    lines = [re.sub(r"^[•\-\*\s]+", "", l).strip() for l in lines if l]

    final_str = "\n".join(lines).strip()
    return final_str if final_str else "NOT_FOUND"


def match_requirements(
    candidate_profile: Dict[str, Any],
    jd_requirements: Dict[str, Any],
) -> Dict[str, List[RequirementMatchDict]]:
    """Match each Job Description requirement against candidate profile evidence with precise evidence selection.

    Args:
        candidate_profile: Parsed candidate profile dictionary.
        jd_requirements: Parsed JD requirements dictionary containing 'requirements' list.

    Returns:
        Dict with key 'matches' containing list of RequirementMatchDict objects.

    Raises:
        MatcherError: If inputs are invalid or missing required keys.
    """
    if not candidate_profile or not isinstance(candidate_profile, dict):
        raise MatcherError("Invalid or missing candidate profile data.")

    if not jd_requirements or not isinstance(jd_requirements, dict) or "requirements" not in jd_requirements:
        raise MatcherError("Invalid or missing job description requirements data.")

    requirements_list = jd_requirements["requirements"]
    if not isinstance(requirements_list, list):
        raise MatcherError("Job description requirements must be a list.")

    matches: List[RequirementMatch] = []

    for req in requirements_list:
        req_id = req.get("requirement_id", "REQ_UNKNOWN")
        category = req.get("category", "OTHER")
        req_value = req.get("value", "")
        priority = req.get("priority", "UNSPECIFIED")
        jd_evidence = req.get("evidence", req_value)

        status, raw_resume_evidence, source_section = _match_single_requirement(
            category=category,
            req_value=req_value,
            jd_evidence=jd_evidence,
            candidate_profile=candidate_profile,
        )

        cleaned_resume_evidence = clean_evidence(raw_resume_evidence)

        matches.append(
            RequirementMatch(
                requirement_id=req_id,
                category=category,
                requirement_value=req_value,
                priority=priority,
                status=status,
                jd_evidence=jd_evidence,
                resume_evidence=cleaned_resume_evidence,
                source_section=source_section if status != "NOT_FOUND" else None,
            )
        )

    profile = MatchProfile(matches=matches)
    return profile.to_dict()


def _match_single_requirement(
    category: str,
    req_value: str,
    jd_evidence: str,
    candidate_profile: Dict[str, Any],
) -> Tuple[str, str, Optional[str]]:
    """Match a single requirement against candidate profile evidence."""
    cat_upper = category.upper()

    if cat_upper == "SKILL":
        return _match_skill(req_value, candidate_profile)
    elif cat_upper == "EXPERIENCE":
        return _match_experience(req_value, candidate_profile)
    elif cat_upper == "EDUCATION":
        return _match_education(req_value, candidate_profile)
    elif cat_upper == "CERTIFICATION":
        return _match_certification(req_value, candidate_profile)
    elif cat_upper == "RESPONSIBILITY":
        return _match_responsibility(req_value, candidate_profile)
    else:
        return _match_generic(req_value, candidate_profile)


def _get_discrete_resume_snippets(candidate_profile: Dict[str, Any]) -> List[Tuple[str, str]]:
    """Gather discrete line/item snippets from candidate profile.

    Returns:
        List of tuples: (snippet_text, section_name)
    """
    snippets: List[Tuple[str, str]] = []

    # 1. Skills items & evidence lines
    skills_field = candidate_profile.get("skills", {})
    if isinstance(skills_field, dict) and skills_field.get("status") == "FOUND":
        val = skills_field.get("value")
        if isinstance(val, list):
            for item in val:
                if isinstance(item, str) and item.strip():
                    snippets.append((item.strip(), "skills"))
        ev = skills_field.get("evidence")
        if isinstance(ev, str):
            for line in ev.split("\n"):
                clean = line.strip()
                if clean:
                    snippets.append((clean, "skills"))

    # 2. Experience lines / bullets
    exp_field = candidate_profile.get("experience", {})
    if isinstance(exp_field, dict) and exp_field.get("status") == "FOUND":
        ev = exp_field.get("evidence")
        if isinstance(ev, str):
            for line in ev.split("\n"):
                clean = line.strip()
                if clean:
                    snippets.append((clean, "experience"))

    # 3. Projects lines / bullets
    proj_field = candidate_profile.get("projects", {})
    if isinstance(proj_field, dict) and proj_field.get("status") == "FOUND":
        ev = proj_field.get("evidence")
        if isinstance(ev, str):
            for line in ev.split("\n"):
                clean = line.strip()
                if clean:
                    snippets.append((clean, "projects"))

    # 4. Certifications
    cert_field = candidate_profile.get("certifications", {})
    if isinstance(cert_field, dict) and cert_field.get("status") == "FOUND":
        ev = cert_field.get("evidence")
        if isinstance(ev, str):
            for line in ev.split("\n"):
                clean = line.strip()
                if clean:
                    snippets.append((clean, "certifications"))

    # 5. Education
    edu_field = candidate_profile.get("education", {})
    if isinstance(edu_field, dict) and edu_field.get("status") == "FOUND":
        ev = edu_field.get("evidence")
        if isinstance(ev, str):
            for line in ev.split("\n"):
                clean = line.strip()
                if clean:
                    snippets.append((clean, "education"))

    return snippets


def _extract_target_terms(req_value: str) -> List[str]:
    """Extract explicit skill / technology keywords from requirement string."""
    req_lower = req_value.lower()
    known_keywords = [
        "python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "rust", "ruby", "php",
        "react", "angular", "vue", "next.js", "node.js", "express", "fastapi", "flask", "django",
        "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "supabase",
        "docker", "kubernetes", "aws", "azure", "gcp", "git", "github", "linux",
        "rest api", "rest apis", "graphql", "machine learning", "deep learning", "tensorflow", "pytorch",
        "scikit-learn", "yolo", "opencv", "nlp", "generative ai", "llm", "llms", "rag", "ai agents",
        "cybersecurity", "networking", "tcp/ip", "vulnerability scanning", "port & service discovery"
    ]

    terms: List[str] = []
    for kw in known_keywords:
        if re.search(rf"\b{re.escape(kw)}\b", req_lower):
            terms.append(kw)

    if not terms:
        words = [w for w in re.findall(r"\b\w{3,}\b", req_lower) if w not in ["with", "and", "for", "the", "such", "that", "from"]]
        terms = words if words else [req_lower]

    return terms


def _match_skill(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    target_terms = _extract_target_terms(req_value)
    snippets = _get_discrete_resume_snippets(candidate_profile)

    matched_terms: Set[str] = set()
    scored_snippets: List[Tuple[int, str, str]] = []

    for snip_text, sec_name in snippets:
        if snip_text.startswith("Programming:") or snip_text.startswith("Tools:") or snip_text.startswith("Databases:"):
            continue

        snip_lower = snip_text.lower()
        match_count = 0
        for term in target_terms:
            alias = SKILL_ALIASES.get(term, term)
            if re.search(rf"\b{re.escape(term)}\b", snip_lower) or re.search(rf"\b{re.escape(alias)}\b", snip_lower):
                matched_terms.add(term)
                match_count += 1

        if match_count > 0:
            scored_snippets.append((match_count, snip_text, sec_name))

    scored_snippets.sort(key=lambda x: x[0], reverse=True)

    best_matching_snippets: List[str] = []
    source_sec: Optional[str] = None

    for count, snip_text, sec_name in scored_snippets:
        if snip_text not in best_matching_snippets:
            best_matching_snippets.append(snip_text)
            if not source_sec:
                source_sec = SECTION_DISPLAY_NAMES.get(sec_name, sec_name.capitalize())

    if len(matched_terms) == len(target_terms) and matched_terms:
        evidence_str = "\n".join(best_matching_snippets[:2]) if best_matching_snippets else "NOT_FOUND"
        return ("MATCHED", evidence_str, source_sec)
    elif len(matched_terms) > 0:
        evidence_str = "\n".join(best_matching_snippets[:2]) if best_matching_snippets else "NOT_FOUND"
        return ("PARTIAL", evidence_str, source_sec)

    return ("NOT_FOUND", "NOT_FOUND", None)


def _match_experience(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    exp_field = candidate_profile.get("experience", {})
    if isinstance(exp_field, dict) and exp_field.get("status") == "FOUND":
        ev = exp_field.get("evidence", "")
        if ev and ev != "NOT_FOUND":
            return ("MATCHED", str(ev).strip(), "Experience")

    proj_field = candidate_profile.get("projects", {})
    if isinstance(proj_field, dict) and proj_field.get("status") == "FOUND":
        ev = proj_field.get("evidence", "")
        if ev and ev != "NOT_FOUND":
            return ("PARTIAL", str(ev).strip(), "Projects")

    return ("NOT_FOUND", "NOT_FOUND", None)


def _match_education(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    edu_field = candidate_profile.get("education", {})
    if isinstance(edu_field, dict) and edu_field.get("status") == "FOUND":
        ev = edu_field.get("evidence", "")
        if ev and ev != "NOT_FOUND":
            edu_lower = str(ev).lower()
            if any(k in edu_lower for k in ["bachelor", "b.e.", "b.tech", "computer science"]):
                return ("MATCHED", str(ev).strip(), "Education")
            return ("PARTIAL", str(ev).strip(), "Education")

    return ("NOT_FOUND", "NOT_FOUND", None)


def _match_certification(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    cert_field = candidate_profile.get("certifications", {})
    if isinstance(cert_field, dict) and cert_field.get("status") == "FOUND":
        ev = cert_field.get("evidence", "")
        if ev and ev != "NOT_FOUND":
            req_words = [w.lower() for w in req_value.split() if len(w) > 3]
            for cert_line in str(ev).split("\n"):
                cert_lower = cert_line.lower()
                if any(w in cert_lower for w in req_words):
                    return ("MATCHED", cert_line.strip(), "Certifications")
            return ("PARTIAL", str(ev).strip(), "Certifications")

    return ("NOT_FOUND", "NOT_FOUND", None)


def _match_responsibility(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    req_words = set(re.findall(r"\b\w{4,}\b", req_value.lower()))
    snippets = _get_discrete_resume_snippets(candidate_profile)

    best_match_count = 0
    best_snippet = ""
    best_sec: Optional[str] = None

    for snip_text, sec_name in snippets:
        line_words = set(re.findall(r"\b\w{4,}\b", snip_text.lower()))
        overlap = req_words.intersection(line_words)
        if len(overlap) > best_match_count:
            best_match_count = len(overlap)
            best_snippet = snip_text
            best_sec = SECTION_DISPLAY_NAMES.get(sec_name, sec_name.capitalize())

    if best_match_count >= 2:
        return ("MATCHED", best_snippet, best_sec)
    elif best_match_count == 1:
        return ("PARTIAL", best_snippet, best_sec)

    return ("NOT_FOUND", "NOT_FOUND", None)


def _match_generic(req_value: str, candidate_profile: Dict[str, Any]) -> Tuple[str, str, Optional[str]]:
    req_words = set(re.findall(r"\b\w{4,}\b", req_value.lower()))
    if not req_words:
        return ("NOT_FOUND", "NOT_FOUND", None)

    snippets = _get_discrete_resume_snippets(candidate_profile)
    best_match_count = 0
    best_snippet = ""
    best_sec: Optional[str] = None

    for snip_text, sec_name in snippets:
        line_words = set(re.findall(r"\b\w{4,}\b", snip_text.lower()))
        overlap = req_words.intersection(line_words)
        if len(overlap) > best_match_count:
            best_match_count = len(overlap)
            best_snippet = snip_text
            best_sec = SECTION_DISPLAY_NAMES.get(sec_name, sec_name.capitalize())

    if best_match_count >= 2:
        return ("MATCHED", best_snippet, best_sec)
    elif best_match_count == 1:
        return ("PARTIAL", best_snippet, best_sec)

    return ("NOT_FOUND", "NOT_FOUND", None)
