"""Main CLI entry point for Resume Parser Agent."""

import argparse
import json
import sys
from app.extractor import ExtractionError, extract_text
from app.field_parser import parse_fields
from app.jd_parser import JDParseError, parse_jd, read_jd_file
from app.matcher import MatcherError, match_requirements
from app.scorer import ScorerError, calculate_scores
from app.segmenter import segment_text


def main() -> None:
    parser = argparse.ArgumentParser(description="Resume Parser Agent CLI")
    parser.add_argument(
        "--file",
        required=True,
        help="Path to the resume file (PDF/DOCX)",
    )
    parser.add_argument(
        "--jd",
        required=False,
        help="Path to the job description file (.txt)",
    )

    args = parser.parse_args()

    try:
        # 1. Resume Processing Pipeline
        extracted_text = extract_text(args.file)
        print("===== EXTRACTED RESUME TEXT =====\n")
        print(extracted_text)

        sections = segment_text(extracted_text)
        print("\n===== SEGMENTED SECTIONS =====\n")
        for sec in sections:
            sec_id = sec["section_id"]
            heading = sec["heading"] or "(None)"
            text = sec["text"]
            print(f"[SECTION: {sec_id}]")
            print(f"Original Heading: {heading}")
            print(text)
            print()
        print("===== SEGMENTATION COMPLETE =====")

        parsed_fields = parse_fields(sections)
        print("\n===== PARSED CANDIDATE FIELDS =====\n")
        print(json.dumps(parsed_fields, indent=2))
        print("\n===== FIELD PARSING COMPLETE =====")

        # 2. Job Description Processing & Matching Pipeline
        if args.jd:
            jd_text = read_jd_file(args.jd)
            jd_result = parse_jd(jd_text)
            requirements = jd_result.get("requirements", [])

            print("\n===== PARSED JOB REQUIREMENTS =====\n")
            for req in requirements:
                print(f"[{req['requirement_id']}]")
                print(f"Category: {req['category']}")
                print(f"Value: {req['value']}")
                print(f"Priority: {req['priority']}")
                print(f"Evidence: {req['evidence']}")
                print()
            print("===== JD PARSING COMPLETE =====")

            # 3. Requirement Matching & Precise Evidence Selection
            match_result = match_requirements(parsed_fields, jd_result)
            matches = match_result.get("matches", [])

            print("\n===== REQUIREMENT MATCH RESULTS =====\n")
            for m in matches:
                print(f"[{m['requirement_id']}]")
                print(f"Category: {m['category']}")
                print(f"Requirement: {m['requirement_value']}")
                print(f"Priority: {m['priority']}")
                print(f"Status: {m['status']}")
                print(f"JD Evidence: {m['jd_evidence']}")
                print(f"Resume Evidence: {m['resume_evidence']}")
                print()
            print("===== MATCHING COMPLETE =====")

            # 4. Deterministic Resume-to-Job Scoring Engine
            scores = calculate_scores(match_result)
            cat_scores = scores.get("category_scores", {})
            req_scores = scores.get("requirement_scores", [])

            print("\n===== RESUME MATCH SCORE =====\n")
            print(f"Overall Score: {scores['overall_score']:.2f}%")
            print(f"Earned Score: {scores['earned_score']}")
            print(f"Maximum Score: {scores['maximum_score']}")

            print("\n===== CATEGORY SCORES =====\n")
            for cat_name in ["EXPERIENCE", "RESPONSIBILITY", "SKILL", "EDUCATION"]:
                cs = cat_scores.get(cat_name, {"percentage": 0.0})
                print(f"{cat_name}: {cs['percentage']:.2f}%")

            print("\n===== REQUIREMENT SCORES =====\n")
            for rs in req_scores:
                print(f"[{rs['requirement_id']}]")
                print(f"Category: {rs['category']}")
                print(f"Priority: {rs['priority']}")
                print(f"Status: {rs['status']}")
                print(f"Weight: {rs['weight']}")
                print(f"Score: {rs['score']}")
                print()
            print("===== SCORING COMPLETE =====")

    except ExtractionError as e:
        print(f"Extraction Error: {e}", file=sys.stderr)
        sys.exit(1)
    except JDParseError as e:
        print(f"JD Parse Error: {e}", file=sys.stderr)
        sys.exit(1)
    except MatcherError as e:
        print(f"Matcher Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ScorerError as e:
        print(f"Scorer Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()






