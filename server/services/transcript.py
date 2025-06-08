import json
import os
import re
import pdfplumber


def extract_transcript(pdf_path) -> list:
    transcript_info = []
    course_pattern = r'\b(?P<code>[A-Z]+(?:\s+(?:[A-Z]+|[0-9]{4}[A-Z]?))(?:\s+[0-9]{4}[A-Z]?)?)\s+' \
        r'(?:UG\s+)?' \
        r'(?P<title>(?:[A-Z0-9&-]+\s+)+?)' \
        r'(?=(?:[ABCDFW]\s+\d+\.\d+)|(?:\d+\.\d+\s*$))' \
        r'(?P<grade>[ABCDFW])?\s*\d+\.\d+(?:\s+\d+\.\d+)?\s*$'
    major_pattern = re.compile(
        r'^(?P<category>Major|Minor):\s*(?P<name>[A-Za-z\s&]+)$', re.IGNORECASE | re.MULTILINE)
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_lines = page.extract_text().splitlines()
            for line in page_lines:
                major_match = major_pattern.finditer(line)
                if major_match:
                    major_minor = {}
                    for match in major_match:
                        field = match.group("category").title()
                        value = match.group("name").strip()
                        major_minor[field] = value
                        transcript_info.append(major_minor)

                course_match = re.search(course_pattern, line)
                if course_match:
                    course = {}
                    course['course_code'] = course_match.group("code")
                    # Might be None if not present.
                    course['course_grade'] = course_match.group("grade")
                    transcript_info.append(course)

    return transcript_info


def find_major_database(major):
    major_info = None
    for root, dirs, files in os.walk('./data'):
        for file in files:
            if file.lower().startswith(major):
                with open(os.path.join(root, file), 'r') as f:
                    major_info = json.load(f)
    return major_info