from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-image", methods=["POST"])
def upload_image():
    print(">>> /upload-image HIT")

    try:
        # FORCE JSON parsing (this fixes your issue)
        data = request.get_json(force=True)
        print(">>> Received data:", data.keys())

        if "image" not in data:
            return jsonify({"error": "image key missing"}), 400

        image_data = data["image"]

        if not image_data:
            return jsonify({"error": "empty image data"}), 400

        # Remove base64 header safely
        if image_data.startswith("data:image"):
            image_data = image_data.split(",", 1)[1]

        # Decode base64 safely
        image_bytes = base64.b64decode(image_data, validate=True)

        if len(image_bytes) == 0:
            return jsonify({"error": "decoded image is empty"}), 400

        # Ensure upload folder exists AGAIN (important)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filename = f"{data.get('username','worker')}_{int(datetime.now().timestamp())}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        print("Image saved at:", os.path.abspath(filepath))

        return jsonify({"status": "success", "file": filename}), 200

    except Exception as e:
        print("BACKEND ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)