from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from PyPDF2 import PdfReader

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return jsonify({
        "message": "Backend Running Successfully 🚀"
    })

@app.route("/upload_resume", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    text = ""

    if file.filename.endswith(".pdf"):
        reader = PdfReader(filepath)

        for page in reader.pages:
            extracted = page.extract_text()

            if extracted:
                text += extracted

    return jsonify({
        "filename": file.filename,
        "resume_text": text[:3000]
    })

if __name__ == "__main__":
    app.run(debug=True)
