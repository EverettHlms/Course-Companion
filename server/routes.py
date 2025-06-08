from flask import request, jsonify
import os
from services.transcript import extract_transcript, find_major_database
from services.scraper import find_classes_for_course, create_browser_instance
from playwright.sync_api import sync_playwright, Browser


def register_routes(app):
    @app.route("/view_courses", methods=["GET"])
    def view_courses():
        with sync_playwright() as p:
            browser = create_browser_instance(p)
            course_code = request.args.get("course_code")
            if not course_code:
                return jsonify({"error": "No course code provided"}), 400

            classes = find_classes_for_course(browser, course_code)
            browser.close()
            return jsonify(classes), 200

    @app.route("/upload", methods=["POST"])
    def upload_transcript():
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Save uploaded file
        upload_folder = app.config.get("UPLOAD_FOLDER", "./uploads")
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)

        # Parse transcript
        transcript_info = extract_transcript(file_path)
        if not transcript_info:
            return jsonify({"error": "Could not extract transcript info"}), 400

        # Get major
        major = transcript_info[0]['Major'].lower().replace(" ", "_")
        major_info = find_major_database(major)

        if not major_info:
            return jsonify({"error": f"No course data found for major: {major}"}), 404

        courses_not_yet_taken = []
        courses_taken = []
        for course in major_info['courses']:
            if course['course_code'] not in [c['course_code'] for c in transcript_info if 'course_code' in c]:
                courses_not_yet_taken.append(course)
            else:
                # We need to figure out how to also include core classes too if students have taken them.
                # We'll probably skip out on this feature for now to keep it simple.
                courses_taken.append(course)
                
        # Remvoe file after processing
        os.remove(file_path)

        return jsonify({"courses_taken": courses_taken, "courses_not_yet_taken": courses_not_yet_taken}), 200
