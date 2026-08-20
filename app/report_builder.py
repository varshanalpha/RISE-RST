"""Deterministic Result Report Builder Module."""

from typing import Any, Dict, List, Optional
from app.models import MatchReportDict, ReportCategoryScoreDict, ReportRequirementDict, ReportSummaryDict


class ReportBuilderError(Exception):
    """Raised when input data to report builder is missing or invalid."""

    pass


def build_report(
    match_results: Dict[str, Any],
    score_results: Dict[str, Any],
) -> MatchReportDict:
    """Build a unified, structured, JSON-serializable report from match and score results.

    Args:
        match_results: Dictionary output from match_requirements().
        score_results: Dictionary output from calculate_scores().

    Returns:
        MatchReportDict structure matching Prompt 9 specifications.

    Raises:
        ReportBuilderError: If match_results or score_results are missing or invalid.
    """
    if not match_results or not isinstance(match_results, dict) or "matches" not in match_results:
        raise ReportBuilderError("Invalid or missing match results data.")

    if not score_results or not isinstance(score_results, dict) or "overall_score" not in score_results:
        raise ReportBuilderError("Invalid or missing score results data.")

    matches = match_results["matches"]
    req_scores_list = score_results.get("requirement_scores", [])
    cat_scores_in = score_results.get("category_scores", {})

    score_lookup: Dict[str, Dict[str, Any]] = {
        rs["requirement_id"]: rs for rs in req_scores_list if "requirement_id" in rs
    }

    matched_reqs: List[ReportRequirementDict] = []
    partial_reqs: List[ReportRequirementDict] = []
    not_found_reqs: List[ReportRequirementDict] = []

    for m in matches:
        req_id = m.get("requirement_id", "REQ_UNKNOWN")
        category = m.get("category", "OTHER")
        req_val = m.get("requirement_value", "")
        priority = m.get("priority", "UNSPECIFIED")
        status = m.get("status", "NOT_FOUND")
        raw_ev = m.get("resume_evidence")

        rs_data = score_lookup.get(req_id, {})
        weight = rs_data.get("weight", 1.0)
        score = rs_data.get("score", 0.0)

        if status == "NOT_FOUND" or raw_ev == "NOT_FOUND" or not raw_ev:
            evidence_val = None
        else:
            evidence_val = str(raw_ev)

        source_section = m.get("source_section")

        item: ReportRequirementDict = {
            "requirement_id": req_id,
            "category": category,
            "requirement": req_val,
            "priority": priority,
            "status": status,
            "weight": float(weight),
            "score": float(score),
            "resume_evidence": evidence_val,
            "source_section": source_section,
        }

        if status == "MATCHED":
            matched_reqs.append(item)
        elif status == "PARTIAL":
            partial_reqs.append(item)
        else:
            not_found_reqs.append(item)

    formatted_cat_scores: Dict[str, ReportCategoryScoreDict] = {}
    for cat_name, cat_data in cat_scores_in.items():
        earned = float(cat_data.get("earned_score", 0.0))
        maximum = float(cat_data.get("maximum_score", 0.0))
        pct = float(cat_data.get("percentage", 0.0))
        formatted_cat_scores[cat_name] = {
            "score": round(earned, 2),
            "maximum_score": round(maximum, 2),
            "percentage": round(pct, 2),
        }

    summary: ReportSummaryDict = {
        "total_requirements": len(matches),
        "matched_count": len(matched_reqs),
        "partial_count": len(partial_reqs),
        "not_found_count": len(not_found_reqs),
    }

    report: MatchReportDict = {
        "overall_score": round(float(score_results.get("overall_score", 0.0)), 2),
        "earned_score": round(float(score_results.get("earned_score", 0.0)), 2),
        "maximum_score": round(float(score_results.get("maximum_score", 0.0)), 2),
        "category_scores": formatted_cat_scores,
        "requirements": {
            "matched": matched_reqs,
            "partial": partial_reqs,
            "not_found": not_found_reqs,
        },
        "summary": summary,
    }

    return report
