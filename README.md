# Resume Parser Agent

> **Phase 10: Human-Readable Report Generation & Output Exporter**

A CLI-based system that processes resume files (PDF/DOCX) alongside job descriptions to extract structured candidate profiles with traceable text evidence, score job fit, and export human-readable Markdown and structured JSON reports.









## Planned Architecture

```text
Resume PDF/DOCX
→ Text Extractor
→ Section Segmenter
→ Field Parser
→ Structured Candidate Profile with Evidence
→ Job Description Scorer
→ profile.json + report.md
```

## Setup & Installation

1. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Example CLI Usage

Run resume text extraction on a PDF or DOCX file:

```bash
python3 -m app.main --file samples/resumes/<resume_filename> --jd samples/job_descriptions/sample.txt
```

