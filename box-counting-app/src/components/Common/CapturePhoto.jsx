import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import "./capturePhoto.css";

export default function CapturePhoto({ onDone, user }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [captured, setCaptured] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load models and start camera
  useEffect(() => {
    const init = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Initialization error:", err);
        alert("Camera access denied or models missing.");
      }
    };

    init();
  }, []);

  // Face detection loop
  useEffect(() => {
    if (!videoRef.current || captured) return;

    const intervalId = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaceDetected(detections.length > 0);
    }, 500);

    return () => clearInterval(intervalId);
  }, [captured]);

  // FIXED capture function
  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    // Resize to reduce payload
    const MAX_WIDTH = 640;
    const scale = MAX_WIDTH / video.videoWidth;

    canvas.width = MAX_WIDTH;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Generate image AFTER drawing
    const imageData = canvas.toDataURL("image/jpeg", 0.6);

    // Stop camera after capture
    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());

    setCaptured(imageData);
  };

  const handleSaveAndRedirect = async () => {
    console.log("Sending image to backend...");
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: captured,
          username: user?.username || "worker_session",
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      onDone();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("System error: Could not save image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="capture-root">
      <div className="capture-card">
        <h1>Identity Verification</h1>
        <p>{faceDetected ? "Face Detected" : "No Face Detected"}</p>

        {!captured ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="camera-preview"
          />
        ) : (
          <img src={captured} className="camera-preview" alt="Identity" />
        )}

        <canvas ref={canvasRef} hidden />

        <div className="button-group">
          {!captured ? (
            <button
              className="primary-btn"
              onClick={capture}
              disabled={!faceDetected}
            >
              Capture
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={handleSaveAndRedirect}
              disabled={isSaving}
            >
              OK → Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
