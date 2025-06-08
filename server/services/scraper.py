from datetime import datetime
from playwright.sync_api import sync_playwright
from playwright.sync_api._generated import Browser


def get_current_semester():
    """Determine the current semester for which professors are available."""
    current_month = datetime.now().month
    current_year = datetime.now().year

    # Spring Semester
    if current_month in [1, 2, 3, 4]:
        return f"Spring {current_year}"

    # Summer Semester
    elif current_month in [5, 6, 7]:
        return f"Summer {current_year}"

    # Fall Semester
    elif current_month in [8, 9, 10, 11, 12]:
        return f"Fall {current_year}"


def get_rate_my_professor_url(professor_name: str) -> str:
    return f'https://www.ratemyprofessors.com/search/professors/938?q={professor_name.replace(" ", "%20")}'


def create_browser_instance(p) -> Browser:
    browser = p.chromium.launch()
    return browser


def find_classes_for_course(browser: Browser, course_code: str) -> list:
    COURSE_URL = f"https://hb2504.txst.edu/viewcourse.html#{course_code.replace(' ', '')}"
    current_semester = get_current_semester()

    page = browser.new_page()
    page.goto(COURSE_URL)

    # Check if the course page is missing
    if page.get_by_text("undefined").count() > 0:
        print(f"Course {course_code} does not exist on HB 2504. Skipping.")
        return []

    # Lower timeout to 5 seconds for slow-loading pages
    try:
        page.wait_for_selector('.hb2504-data-row', timeout=5000)
    except:
        print(f"Timeout waiting for class rows in {course_code}. Skipping.")
        return []

    classes = []
    professors = set()

    # Find the current semester header
    semester_header = page.get_by_text(current_semester, exact=True)

    if semester_header.count() > 0:
        semester_section = semester_header.locator(
            "xpath=following-sibling::*[1]").element_handle()

        if semester_section:
            # Get only the rows inside the detected semester
            semester_rows = semester_section.query_selector_all(
                ".hb2504-data-row")

            for row in semester_rows:
                professor = row.query_selector('.person b')
                syllabus = row.query_selector_all(
                    '.links a')[1].get_attribute('href')

                # If no professor is listed, return "TBA"
                professor = professor.inner_text().strip()

                # Ensure no duplicate professors occur
                if professor not in professors:
                    professors.add(professor)
                    class_info = {
                        'professor': professor,
                        'syllabus': syllabus,
                        'rate_my_professor_url': get_rate_my_professor_url(professor)
                    }
                    classes.append(class_info)
    else:
        print(f"{current_semester} section not found for {course_code}. Skipping.")

    return classes


with sync_playwright() as p:
    browser = create_browser_instance(p)
    classes = find_classes_for_course(browser, "CS2308")
    print(classes)
    browser.close()