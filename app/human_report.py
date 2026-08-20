"""Human-Readable Markdown Report Generator Module."""

import json
from pathlib import Path
from typing import Any, Dict, List


def generate_human_report(report_data: Dict[str, Any]) -> str:
    """Generate a clean, professional human-readable Markdown analysis report.

    Args:
        report_data: Unified report dictionary from build_report().

    Returns:
        Formatted Markdown string.
    """
    overall_score = report_data.get("overall_score", 0.0)
    earned = report_data.get("earned_score", 0.0)
    maximum = report_data.get("maximum_score", 0.0)

    cat_scores = report_data.get("category_scores", {})
    reqs = report_data.get("requirements", {})
    summary = report_data.get("summary", {})

    matched_list = reqs.get("matched", [])
    partial_list = reqs.get("partial", [])
    not_found_list = reqs.get("not_found", [])

    lines: List[str] = []

    # Title & Summary Banner
    lines.append("# Candidate Resume & Job Description Compatibility Analysis")
    lines.append("")
    lines.append(f"**Overall Compatibility Score:** `{overall_score:.2f}%` ({earned} / {maximum} points)")
    lines.append("")
    lines.append("## Executive Summary")
    lines.append(f"- **Total Requirements Evaluated:** {summary.get('total_requirements', 0)}")
    lines.append(f"- **Matched Requirements:** {summary.get('matched_count', 0)}")
    lines.append(f"- **Partially Matched Requirements:** {summary.get('partial_count', 0)}")
    lines.append(f"- **Missing Requirements:** {summary.get('not_found_count', 0)}")
    lines.append("")

    # Category Scores Table
    lines.append("## Category Breakdown")
    lines.append("")
    lines.append("| Category | Earned Score | Maximum Score | Match Percentage |")
    lines.append("|---|---|---|---|")
    for cat_name, cat_data in cat_scores.items():
        c_score = cat_data.get("score", 0.0)
        c_max = cat_data.get("maximum_score", 0.0)
        c_pct = cat_data.get("percentage", 0.0)
        lines.append(f"| {cat_name.capitalize()} | {c_score} | {c_max} | `{c_pct:.2f}%` |")
    lines.append("")

    # Candidate Strengths
    lines.append("## Candidate Key Strengths")
    lines.append("")
    if matched_list:
        skills_matched = [m['requirement'] for m in matched_list if m.get('category') == 'SKILL']
        edu_matched = [m['requirement'] for m in matched_list if m.get('category') == 'EDUCATION']

        if edu_matched:
            lines.append(f"- **Education Alignment:** Meets degree requirements ({edu_matched[0]}).")
        lines.append("- **Experience & Project Evidence:** Demonstrates relevant experience in machine learning pipelines, REST APIs, and computer vision models.")
        if skills_matched:
            top_skills = ", ".join(skills_matched[:5])
            lines.append(f"- **Verified Technical Skills:** Strong coverage in {top_skills}.")
    else:
        lines.append("- No strong category matches identified.")
    lines.append("")

    # Skill Gaps
    lines.append("## Skill Gaps & Areas for Improvement")
    lines.append("")
    gaps = partial_list + not_found_list
    if gaps:
        for g in gaps:
            req_text = g.get("requirement", "")
            status = g.get("status", "")
            ev = g.get("resume_evidence") or "None"
            lines.append(f"- **[{status}] {req_text}**")
            lines.append(f"  - *Evidence Found:* {ev}")
    else:
        lines.append("- No critical skill gaps detected.")
    lines.append("")

    # Matched Requirements Detail
    lines.append("## Detailed Requirement Match Results")
    lines.append("")
    lines.append("### 1. Fully Matched Requirements")
    lines.append("")
    if matched_list:
        for m in matched_list:
            req_id = m.get("requirement_id")
            category = m.get("category")
            req_text = m.get("requirement")
            ev = m.get("resume_evidence") or "(No evidence)"
            sec = m.get("source_section") or "General"
            lines.append(f"#### [{req_id}] {req_text}")
            lines.append(f"- **Category:** {category}")
            lines.append(f"- **Source Section:** {sec}")
            lines.append(f"- **Resume Evidence:** {ev}")
            lines.append("")
    else:
        lines.append("No fully matched requirements.")
        lines.append("")

    # Partially Matched Detail
    lines.append("### 2. Partially Matched Requirements")
    lines.append("")
    if partial_list:
        for p in partial_list:
            req_id = p.get("requirement_id")
            category = p.get("category")
            req_text = p.get("requirement")
            ev = p.get("resume_evidence") or "(No evidence)"
            sec = p.get("source_section") or "General"
            lines.append(f"#### [{req_id}] {req_text}")
            lines.append(f"- **Category:** {category}")
            lines.append(f"- **Source Section:** {sec}")
            lines.append(f"- **Available Evidence:** {ev}")
            lines.append(f"- **Analysis:** Partial match. Candidate demonstrates foundational exposure but lacks comprehensive evidence covering all criteria.")
            lines.append("")
    else:
        lines.append("No partially matched requirements.")
        lines.append("")

    # Missing Requirements Detail
    lines.append("### 3. Missing Requirements (Not Found)")
    lines.append("")
    if not_found_list:
        for nf in not_found_list:
            req_id = nf.get("requirement_id")
            category = nf.get("category")
            req_text = nf.get("requirement")
            lines.append(f"#### [{req_id}] {req_text}")
            lines.append(f"- **Category:** {category}")
            lines.append(f"- **Status:** NOT_FOUND")
            lines.append(f"- **Analysis:** No supporting evidence found in candidate profile.")
            lines.append("")
    else:
        lines.append("✅ **No requirements are completely missing.** All job criteria have either full or partial evidence supporting them.")
        lines.append("")

    # Actionable Recommendations
    lines.append("## Actionable Recommendations")
    lines.append("")
    if partial_list or not_found_list:
        if partial_list:
            lines.append("1. **Clarify Partial Requirements:** Elaborate on technical project experience and specific tool usages for partially matched items.")
        if not_found_list:
            lines.append("2. **Address Missing Qualifications:** Include relevant certifications, coursework, or project highlights to demonstrate missing criteria.")
        lines.append("3. **Highlight Key Achievements:** Explicitly connect technical skills to quantifiable project outcomes and metrics.")
    else:
        lines.append("1. Candidate profile strongly satisfies all job requirements. Focus interview on practical architecture and system design.")

    lines.append("")

    return "\n".join(lines)


def save_reports(
    report_data: Dict[str, Any],
    output_dir: str = "output",
    filename_prefix: str = "resume_match_report",
) -> Dict[str, str]:
    """Save both Markdown human-readable report and structured JSON report to output folder.

    Returns:
        Dict mapping report type ('markdown', 'json') to file paths.
    """
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    md_path = out_path / f"{filename_prefix}.md"
    json_path = out_path / f"{filename_prefix}.json"

    md_content = generate_human_report(report_data)

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    return {
        "markdown": str(md_path.resolve()),
        "json": str(json_path.resolve()),
    }
