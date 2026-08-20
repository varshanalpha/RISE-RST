"""Main CLI entry point for Resume Parser Agent."""

import argparse
import sys
from app.extractor import ExtractionError, extract_text


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
        print("\n===== EXTRACTION COMPLETE =====")
    except ExtractionError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

