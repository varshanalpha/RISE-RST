"""Main CLI entry point for Resume Parser Agent."""

import argparse
import json
import sys
from app.extractor import ExtractionError, extract_text
from app.field_parser import parse_fields
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
        help="Path to the job description file",
    )

    args = parser.parse_args()

    try:
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
    except ExtractionError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()



