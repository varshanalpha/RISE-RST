"""Deterministic Resume-to-Job Scoring Engine Module."""

from typing import Any, Dict, List
from app.models import CategoryScore, RequirementScore, ScoreProfile, ScoreProfileDict


class ScorerError(Exception):
    """Raised when scoring inputs are missing or invalid."""

    pass


# Priority weights
PRIORITY_WEIGHTS: Dict[str, float] = {
    "REQUIRED": 3.0,
    "PREFERRED": 2.0,
    "UNSPECIFIED": 1.0,
}

# Status multipliers
STATUS_MULTIPLIERS: Dict[str, float] = {
    "MATCHED": 1.0,
    "PARTIAL": 0.5,
    "NOT_FOUND": 0.0,
}

TARGET_CATEGORIES = ["EXPERIENCE", "RESPONSIBILITY", "SKILL", "EDUCATION"]


def calculate_scores(match_results: Dict[str, Any]) -> ScoreProfileDict:
    """Calculate deterministic overall, category-level, and requirement-level scores.

    Args:
        match_results: Dictionary containing 'matches' list from requirement matcher.

    Returns:
        ScoreProfileDict structure with overall_score, category_scores, requirement_scores.

    Raises:
        ScorerError: If match_results is invalid or missing required keys.
    """
    if not match_results or not isinstance(match_results, dict) or "matches" not in match_results:
        raise ScorerError("Invalid or missing match results data.")

    matches_list = match_results["matches"]
    if not isinstance(matches_list, list):
        raise ScorerError("Match results 'matches' must be a list.")

    req_scores: List[RequirementScore] = []
    earned_total = 0.0
    max_total = 0.0

    # Category trackers: category -> {"earned": float, "max": float}
    cat_trackers: Dict[str, Dict[str, float]] = {
        cat: {"earned": 0.0, "max": 0.0} for cat in TARGET_CATEGORIES
    }

    for m in matches_list:
        req_id = m.get("requirement_id", "REQ_UNKNOWN")
        cat = m.get("category", "OTHER").upper()
        prio = m.get("priority", "UNSPECIFIED").upper()
        stat = m.get("status", "NOT_FOUND").upper()

        weight = PRIORITY_WEIGHTS.get(prio, 1.0)
        multiplier = STATUS_MULTIPLIERS.get(stat, 0.0)
        score = round(weight * multiplier, 4)

        earned_total += score
        max_total += weight

        if cat in cat_trackers:
            cat_trackers[cat]["earned"] += score
            cat_trackers[cat]["max"] += weight

        req_scores.append(
            RequirementScore(
                requirement_id=req_id,
                category=cat,
                priority=prio,
                status=stat,
                weight=weight,
                score=score,
            )
        )

    earned_total = round(earned_total, 4)
    max_total = round(max_total, 4)
    overall_percentage = round((earned_total / max_total * 100.0), 2) if max_total > 0 else 0.0

    cat_scores: Dict[str, CategoryScore] = {}
    for cat in TARGET_CATEGORIES:
        c_earned = round(cat_trackers[cat]["earned"], 4)
        c_max = round(cat_trackers[cat]["max"], 4)
        c_pct = round((c_earned / c_max * 100.0), 2) if c_max > 0 else 0.0
        cat_scores[cat] = CategoryScore(
            earned_score=c_earned,
            maximum_score=c_max,
            percentage=c_pct,
        )

    profile = ScoreProfile(
        overall_score=overall_percentage,
        earned_score=earned_total,
        maximum_score=max_total,
        category_scores=cat_scores,
        requirement_scores=req_scores,
    )

    return profile.to_dict()
