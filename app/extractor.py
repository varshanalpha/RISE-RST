"""Text extraction module for processing PDF and DOCX resume files."""

from pathlib import Path
import docx
import pdfplumber


class ExtractionError(Exception):
    """Raised when resume text extraction fails."""

    pass


def extract_text(file_path: str) -> str:
    """Extract and normalize raw text from a PDF or DOCX resume file.

    Args:
        file_path: Path to the resume file (.pdf or .docx).

    Returns:
        Normalized extracted text string.

    Raises:
        ExtractionError: If file is missing, format is unsupported, or no text is extracted.
    """
    path = Path(file_path)

    if not path.is_file():
        raise ExtractionError(f"Resume file not found: {file_path}")

    ext = path.suffix.lower()

    if ext == ".pdf":
        raw_text = _extract_pdf(path)
    elif ext == ".docx":
        raw_text = _extract_docx(path)
    else:
        raise ExtractionError("Unsupported file format. Supported formats: PDF, DOCX.")

    normalized_text = _normalize_text(raw_text)

    if not normalized_text.strip():
        raise ExtractionError("No extractable text found in the document.")

    return normalized_text


def _extract_pdf(path: Path) -> str:
    try:
        pages_text = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
        return "\n\n".join(pages_text)
    except Exception as e:
        raise ExtractionError(f"Failed to extract PDF text: {e}") from e


def _extract_docx(path: Path) -> str:
    try:
        doc = docx.Document(path)
        paragraphs_text = [p.text for p in doc.paragraphs if p.text and p.text.strip()]
        return "\n".join(paragraphs_text)
    except Exception as e:
        raise ExtractionError(f"Failed to extract DOCX text: {e}") from e


def _normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in text.split("\n")]
    normalized_lines = []
    blank_count = 0
    for line in lines:
        if not line.strip():
            blank_count += 1
            if blank_count <= 1:
                normalized_lines.append("")
        else:
            blank_count = 0
            normalized_lines.append(line)
    return "\n".join(normalized_lines).strip()

