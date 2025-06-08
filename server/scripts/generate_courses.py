import requests
import json
import re
import os
import unicodedata
from bs4 import BeautifulSoup

def handle_ascii(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

HOME_URL = "https://mycatalog.txstate.edu"
COURSE_PATH = '/courses/'
response = requests.get(HOME_URL + COURSE_PATH)

# Fetch HTML of main catalog page
if response.status_code == 200:
    home_html = response.text
else:
    print("Failed to retrieve the home webpage. Status code:", response.status_code)
    
# Use beautifulsoup to parse the HTML
soup = BeautifulSoup(home_html, "html.parser")

# Find all the links to each program in the catalog.
# Program = The cirriculum that contains the courses e.g. Computer Science
# Course = The individual courses e.g. CS 1428
programs = soup.find('ul', class_='levelone').find_all('li')

for program in programs:
    program_info = {}
    program_info['name'] = re.sub(r"\s*\(.*\)", "", program.getText()).replace('\u200b', '') # Remove zero-width space
    program_info['course_catalog_url'] = HOME_URL + program.a['href']
    program_info['courses'] = []
    
    # Go to the course catalog page for this program, and fetch the HTML.
    program_response = requests.get(program_info['course_catalog_url'])
    
    if program_response.status_code == 200:
        program_html = program_response.text
    else:
        print("Failed to retrieve the program webpage. Status code:", response.status_code)
    
    # Parse the HTML of the program page.
    program_soup = BeautifulSoup(program_html, "html.parser")
    courses = program_soup.find_all('div', class_='courseblock')
    
    # Loop through each course in the program's page, and extract course information.
    for course in courses:
        course_info = {}
        course_name = handle_ascii(course.find('p', class_='courseblocktitle').getText())
        course_name_match = re.match(r"^([\w\s]+)\.\s*(.+)$", course_name) # Separate course code and course name
        course_code = course_name_match.group(1)
        course_name = course_name_match.group(2).replace('.', '')
        
        course_info['course_code'] = course_code
        course_info['course_name'] = course_name
        course_info['course_desc'] = handle_ascii(course.find('p', class_='courseblockdesc').getText())
        course_info['course_credits'] = course.find('span', class_='credits').getText().replace('.', '') if course.find('span', class_='credits') else ''
        course_info['course_attributes'] = course.find('span', class_='attributes').getText() if course.find('span', class_='attributes') else ''
        course_info['course_grademode'] = course.find('span', class_='grademode').getText() if course.find('span', class_='grademode') else ''
        program_info['courses'].append(course_info)
    
    print(json.dumps(program_info, indent=4))
    
    # After collecting all the data for a program, create the JSON file in data directory.
    with open(f"{os.getcwd()}/server/data/{re.sub(r'[^\w\s&-]', '', program_info['name']).replace(' ', '_').lower()}.json", "w") as f:
        json.dump(program_info, f, indent=4)