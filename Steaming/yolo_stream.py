import cv2
import time
from ultralytics import YOLO
from flask import Flask, Response

# ===================== CONFIG =====================
CAMERA_INDEX = 0            # External webcam
MODEL_PATH = "yolov8n.pt"     # Fast + stable
CONF_THRESHOLD = 0.6

# Camera resolution (CHANGE HERE)
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FPS = 30

# UI control
MAX_UI_WIDTH = 720
JPEG_QUALITY = 100

# ===================== INIT =====================
app = Flask(__name__)
model = YOLO(MODEL_PATH)

cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
cap.set(cv2.CAP_PROP_FPS, FPS)

if not cap.isOpened():
    raise RuntimeError("❌ Camera not accessible")

# ===================== STREAM =====================
def generate_frames():
    prev_time = 0

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame, conf=CONF_THRESHOLD, stream=True)
        for r in results:
            frame = r.plot()

        curr_time = time.time()
        fps = int(1 / (curr_time - prev_time)) if prev_time else 0
        prev_time = curr_time

        cv2.putText(
            frame, f"FPS: {fps}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1, (0, 255, 0), 2
        )

        ret, buffer = cv2.imencode(
            ".jpg",
            frame,
            [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY]
        )

        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame_bytes +
            b"\r\n"
        )

# ===================== ROUTES =====================
@app.route("/")
def index():
    return f"""
    <html>
    <head>
      <title>YOLO Live</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {{
          margin: 0;
          background: #0e0e0e;
          color: white;
          font-family: Arial;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100vh;
        }}
        header {{
          padding: 12px;
          font-size: 18px;
          width: 100%;
          text-align: center;
          background: #111;
        }}
        img {{
          width: 100%;
          max-width: {MAX_UI_WIDTH}px;
          margin-top: 10px;
          border-radius: 12px;
          box-shadow: 0 0 25px rgba(0,255,0,0.2);
        }}
        footer {{
          margin-top: auto;
          padding: 8px;
          font-size: 12px;
          color: #aaa;
        }}
      </style>
    </head>
    <body>
      <header>YOLO Live Detection</header>
      <img src="/video">
      <footer>Streaming Active</footer>
    </body>
    </html>
    """

@app.route("/video")
def video():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache"
        }
    )

# ===================== MAIN =====================
if __name__ == "__main__":
    print("🚀 YOLO Stream Running at http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, threaded=True)
