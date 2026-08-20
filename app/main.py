"""Main CLI entry point for Resume Parser Agent."""

import argparse
import json
import sys
from app.extractor import ExtractionError, extract_text
from app.field_parser import parse_fields
from app.human_report import save_reports
from app.jd_parser import JDParseError, parse_jd, read_jd_file
from app.matcher import MatcherError, match_requirements
from app.report_builder import ReportBuilderError, build_report
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
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Print verbose internal pipeline outputs to terminal",
    )

    args = parser.parse_args()

    try:
        # 1. Resume Processing Pipeline
        extracted_text = extract_text(args.file)
        sections = segment_text(extracted_text)
        parsed_fields = parse_fields(sections)

        if args.debug:
            print("===== EXTRACTED RESUME TEXT =====\n")
            print(extracted_text)

            print("\n===== SEGMENTED SECTIONS =====\n")
            for sec in sections:
                sec_id = sec["section_id"]
                heading = sec["heading"] or "(None)"
                print(f"[SECTION: {sec_id}] Heading: {heading}")
                print(sec["text"])
                print()

            print("\n===== PARSED CANDIDATE FIELDS =====\n")
            print(json.dumps(parsed_fields, indent=2, ensure_ascii=False))

        # 2. Job Description Processing & Matching Pipeline
        if args.jd:
            jd_text = read_jd_file(args.jd)
            jd_result = parse_jd(jd_text)

            # 3. Requirement Matching & Precise Evidence Selection
            match_result = match_requirements(parsed_fields, jd_result)

            # 4. Deterministic Resume-to-Job Scoring Engine
            scores = calculate_scores(match_result)

            # 5. Deterministic Result Report Generation & Saving Reports
            report = build_report(match_result, scores)
            saved_paths = save_reports(report, output_dir="output", filename_prefix="resume_match_report")

            if args.debug:
                print("\n===== STRUCTURED REPORT JSON =====\n")
                print(json.dumps(report, indent=2, ensure_ascii=False))

            # Concise Terminal Output Summary
            summary = report["summary"]
            print("\n===== RESUME PARSER AGENT ANALYSIS =====\n")
            print(f"Overall Compatibility Score: {report['overall_score']:.2f}% ({report['earned_score']} / {report['maximum_score']} points)")
            print("\nRequirement Counts:")
            print(f"  - Matched Count:   {summary['matched_count']}")
            print(f"  - Partial Count:   {summary['partial_count']}")
            print(f"  - Not Found Count: {summary['not_found_count']}")

            print("\nCategory Performance:")
            for cat_name, cat_data in report["category_scores"].items():
                print(f"  - {cat_name.capitalize():<14}: {cat_data['percentage']:.2f}% ({cat_data['score']} / {cat_data['maximum_score']} pts)")

            print("\nReports Generated Successfully:")
            print(f"  - Human-Readable Report: {saved_paths['markdown']}")
            print(f"  - Structured JSON Data:  {saved_paths['json']}")
            print("\n===== ANALYSIS COMPLETE =====")

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
    except ReportBuilderError as e:
        print(f"Report Builder Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
